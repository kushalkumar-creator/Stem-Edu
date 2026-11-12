const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * GET /api/chapters/:id/test
 * Returns chapter test questions WITHOUT correct answers or explanations
 */
const getChapterTest = async (req, res, next) => {
  try {
    const chapterId = req.params.id;

    const { data: questions, error } = await supabaseAdmin
      .from('questions')
      .select('id, chapter_id, question_text, question_text_hindi, options, options_hindi, difficulty, marks, chapters(title, subjects(name))')
      .eq('chapter_id', chapterId);

    if (error) throw error;

    const sanitizedQuestions = (questions || []).map(q => ({
      _id: q.id,
      id: q.id,
      chapterId: q.chapter_id,
      chapterTitle: q.chapters?.title || '',
      subject: q.chapters?.subjects?.name || '',
      questionText: q.question_text,
      questionTextHindi: q.question_text_hindi,
      options: q.options || [],
      optionsHindi: q.options_hindi || [],
      difficulty: q.difficulty,
      marks: q.marks,
      topic: q.chapters?.title || 'General'
    }));

    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/practice/mode-test
 * Generates custom test based on mode: 'chapter' | 'mixed' | 'timed' (P2-5.3)
 */
const getModeTest = async (req, res, next) => {
  try {
    const { mode = 'chapter', chapterId, classLevel = 10, limit = 10 } = req.query;

    let query = supabaseAdmin
      .from('questions')
      .select('id, chapter_id, question_text, question_text_hindi, options, options_hindi, difficulty, marks, chapters(title, subjects(name))');

    if (mode === 'chapter' && chapterId) {
      query = query.eq('chapter_id', chapterId);
    } else {
      query = query.eq('class_level', Number(classLevel));
    }

    const { data: questions, error } = await query.limit(Number(limit) * 3);
    if (error) throw error;

    const shuffled = (questions || []).sort(() => 0.5 - Math.random()).slice(0, Number(limit));

    const sanitized = shuffled.map(q => ({
      _id: q.id,
      id: q.id,
      chapterId: q.chapter_id,
      chapterTitle: q.chapters?.title || '',
      subject: q.chapters?.subjects?.name || '',
      questionText: q.question_text,
      questionTextHindi: q.question_text_hindi,
      options: q.options || [],
      optionsHindi: q.options_hindi || [],
      difficulty: q.difficulty,
      marks: q.marks,
      topic: q.chapters?.title || 'General'
    }));

    res.json({
      success: true,
      mode,
      totalQuestions: sanitized.length,
      timeLimitMinutes: mode === 'timed' ? Math.max(5, Math.round(sanitized.length * 1.5)) : null,
      questions: sanitized
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/chapters/:id/test/submit
 * Server-side scoring route validating answers, calculating score, and saving TestResult
 */
const submitChapterTest = async (req, res, next) => {
  try {
    const chapterId = req.params.id;
    const userId = req.user.id;
    const { answers = [], timeTakenSeconds = 0, negativeMarking = false } = req.body;

    // 1. Fetch official questions for this chapter
    const { data: questions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('chapter_id', chapterId);

    if (qErr) throw qErr;
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this chapter' });
    }

    const questionMap = new Map();
    questions.forEach(q => {
      questionMap.set(String(q.id), q);
    });

    const submittedAnswersMap = new Map();
    answers.forEach(a => {
      const qId = String(a.questionId || a._id || a.id);
      submittedAnswersMap.set(qId, a.selectedOptionIndex);
    });

    let rawScore = 0;
    const itemizedAnswers = [];

    for (const question of questions) {
      const qId = String(question.id);
      const selectedIndex = submittedAnswersMap.has(qId)
        ? submittedAnswersMap.get(qId)
        : null;

      const isAttempted = selectedIndex !== null && selectedIndex >= 0;
      const isCorrect = isAttempted && selectedIndex === question.correct_option_index;

      if (isCorrect) {
        rawScore += (question.marks || 1);
      } else if (isAttempted && negativeMarking) {
        // CBSE competitive negative marking (-0.25)
        rawScore = Math.max(0, rawScore - 0.25);
      }

      itemizedAnswers.push({
        questionId: question.id,
        questionText: question.question_text,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: question.correct_option_index,
        isCorrect,
        explanation: question.explanation,
        topic: question.topic || 'General'
      });
    }

    const totalQuestions = questions.length;
    const score = Number(rawScore.toFixed(2));
    const percentage = totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

    // 2. Insert into public.test_results
    const { data: testResult, error: saveErr } = await supabaseAdmin
      .from('test_results')
      .insert({
        user_id: userId,
        chapter_id: chapterId,
        total_questions: totalQuestions,
        score,
        percentage,
        answers: itemizedAnswers,
        time_taken_seconds: Number(timeTakenSeconds) || 0
      })
      .select('*')
      .single();

    if (saveErr) throw saveErr;

    // 3. Try recording individual attempts in public.attempts if available (P2-5.4)
    try {
      const attemptRows = itemizedAnswers.map(ans => ({
        user_id: userId,
        question_id: ans.questionId,
        chapter_id: chapterId,
        topic: ans.topic || 'General',
        selected_option_index: ans.selectedOptionIndex,
        correct: ans.isCorrect,
        time_taken: Math.round(Number(timeTakenSeconds) / (itemizedAnswers.length || 1))
      }));
      await supabaseAdmin.from('attempts').insert(attemptRows);
    } catch (attErr) {
      // Table may not yet be migrated, ignore gracefully
    }

    res.status(200).json({
      success: true,
      message: 'Test submitted and scored successfully',
      resultId: testResult.id,
      score,
      totalQuestions,
      percentage,
      timeTakenSeconds: testResult.time_taken_seconds,
      answers: itemizedAnswers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/results/weak-topics
 * Aggregate past test answers to identify weak topics (< 60% accuracy)
 * and automatically synchronize weakness memory facts with Saarthi (P2-5.4, P2-3.9)
 */
const getWeakTopics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: results, error } = await supabaseAdmin
      .from('test_results')
      .select('id, chapter_id, answers, chapters:chapter_id(title, subjects(name))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const topicMap = new Map();

    (results || []).forEach(r => {
      const chapterTitle = r.chapters?.title || 'General';
      const subjectName = r.chapters?.subjects?.name || 'Science';
      const answers = Array.isArray(r.answers) ? r.answers : [];

      answers.forEach(a => {
        const topicName = a.topic && a.topic !== 'General' ? a.topic : chapterTitle;
        if (!topicMap.has(topicName)) {
          topicMap.set(topicName, { topic: topicName, subject: subjectName, total: 0, correct: 0 });
        }
        const stat = topicMap.get(topicName);
        stat.total += 1;
        if (a.isCorrect) {
          stat.correct += 1;
        }
      });
    });

    const topicAccuracy = [];
    const weakTopics = [];

    topicMap.forEach((stat, topic) => {
      const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      const item = {
        topic,
        subject: stat.subject,
        totalAttempts: stat.total,
        correctCount: stat.correct,
        accuracyPercentage: accuracy,
        status: accuracy < 60 ? 'weak' : accuracy >= 80 ? 'strong' : 'moderate'
      };
      topicAccuracy.push(item);
      if (item.status === 'weak') {
        weakTopics.push(item);
      }
    });

    topicAccuracy.sort((a, b) => a.accuracyPercentage - b.accuracyPercentage);

    // Synchronize weak topics into Saarthi memory
    if (weakTopics.length > 0) {
      try {
        const memoryService = require('../src/mentor/memoryService');
        for (const w of weakTopics.slice(0, 3)) {
          await memoryService.recordFact({
            userId,
            category: 'weakness',
            key: `weak_${w.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            value: `Student has ${w.accuracyPercentage}% accuracy in "${w.topic}" (${w.subject}). Needs Socratic concept revision.`,
            confidence: 0.9
          });
        }
      } catch (memErr) {
        console.warn('Memory service weakness sync warning:', memErr.message);
      }
    }

    res.json({
      success: true,
      totalTests: (results || []).length,
      weakTopics,
      topicAccuracy
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/results
 * List past test attempts for the authenticated student, sorted newest first
 */
const getResults = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: results, error } = await supabaseAdmin
      .from('test_results')
      .select(`
        id,
        user_id,
        chapter_id,
        total_questions,
        score,
        percentage,
        answers,
        time_taken_seconds,
        created_at,
        chapters:chapter_id (
          id,
          chapter_number,
          title,
          title_hindi,
          subject_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (results || []).map(r => ({
      _id: r.id,
      id: r.id,
      userId: r.user_id,
      chapterId: r.chapters ? {
        _id: r.chapters.id,
        id: r.chapters.id,
        chapterNumber: r.chapters.chapter_number,
        title: r.chapters.title,
        titleHindi: r.chapters.title_hindi,
        subjectId: r.chapters.subject_id
      } : r.chapter_id,
      totalQuestions: r.total_questions,
      score: r.score,
      percentage: r.percentage,
      answers: r.answers || [],
      timeTakenSeconds: r.time_taken_seconds,
      createdAt: r.created_at
    }));

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/results/:id
 * Fetch detailed result attempt breakdown
 */
const getResultById = async (req, res, next) => {
  try {
    const { data: r, error } = await supabaseAdmin
      .from('test_results')
      .select(`
        id,
        user_id,
        chapter_id,
        total_questions,
        score,
        percentage,
        answers,
        time_taken_seconds,
        created_at,
        chapters:chapter_id (
          id,
          chapter_number,
          title,
          title_hindi,
          subject_id
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!r) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    const formatted = {
      _id: r.id,
      id: r.id,
      userId: r.user_id,
      chapterId: r.chapters ? {
        _id: r.chapters.id,
        id: r.chapters.id,
        chapterNumber: r.chapters.chapter_number,
        title: r.chapters.title,
        titleHindi: r.chapters.title_hindi,
        subjectId: r.chapters.subject_id
      } : r.chapter_id,
      totalQuestions: r.total_questions,
      score: r.score,
      percentage: r.percentage,
      answers: r.answers || [],
      timeTakenSeconds: r.time_taken_seconds,
      createdAt: r.created_at
    };

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChapterTest,
  getModeTest,
  submitChapterTest,
  getWeakTopics,
  getResults,
  getResultById
};
