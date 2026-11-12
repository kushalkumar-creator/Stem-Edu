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
      .select('id, chapter_id, question_text, question_text_hindi, options, options_hindi, difficulty, marks')
      .eq('chapter_id', chapterId);

    if (error) throw error;

    const sanitizedQuestions = (questions || []).map(q => ({
      _id: q.id,
      id: q.id,
      chapterId: q.chapter_id,
      questionText: q.question_text,
      questionTextHindi: q.question_text_hindi,
      options: q.options || [],
      optionsHindi: q.options_hindi || [],
      difficulty: q.difficulty,
      marks: q.marks
    }));

    res.status(200).json(sanitizedQuestions);
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
    const { answers = [], timeTakenSeconds = 0 } = req.body;

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

    let score = 0;
    const itemizedAnswers = [];

    for (const question of questions) {
      const qId = String(question.id);
      const selectedIndex = submittedAnswersMap.has(qId)
        ? submittedAnswersMap.get(qId)
        : null;

      const isCorrect = selectedIndex !== null && selectedIndex === question.correct_option_index;
      if (isCorrect) score += (question.marks || 1);

      itemizedAnswers.push({
        questionId: question.id,
        questionText: question.question_text,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: question.correct_option_index,
        isCorrect,
        explanation: question.explanation
      });
    }

    const totalQuestions = questions.length;
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
  submitChapterTest,
  getResults,
  getResultById
};
