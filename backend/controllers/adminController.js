const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * GET /api/admin/stats
 * Overview counts and metrics
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const [
      { count: users },
      { count: subjects },
      { count: chapters },
      { count: lessons },
      { count: questions },
      { count: diagrams },
      { count: labs },
      { count: testResults }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subjects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('chapters').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('lessons').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('questions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('diagrams').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('labs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('test_results').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      success: true,
      stats: {
        users: users || 0,
        subjects: subjects || 0,
        chapters: chapters || 0,
        lessons: lessons || 0,
        questions: questions || 0,
        diagrams: diagrams || 0,
        labs: labs || 0,
        testResults: testResults || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// SUBJECTS CRUD
// =================================================================

exports.createSubject = async (req, res, next) => {
  try {
    const { name, nameHindi, code, classLevel, board, color, icon, description, descriptionHindi } = req.body;
    const { data: subject, error } = await supabaseAdmin
      .from('subjects')
      .insert({
        name,
        name_hindi: nameHindi || name,
        code: (code || name).toLowerCase().replace(/\s+/g, '-'),
        class_level: classLevel || 10,
        board: board || 'CBSE',
        color: color || '#2563EB',
        icon: icon || 'BookOpen',
        description: description || '',
        description_hindi: descriptionHindi || ''
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({
      success: true,
      subject: {
        ...subject,
        _id: subject.id,
        nameHindi: subject.name_hindi,
        classLevel: subject.class_level
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.nameHindi !== undefined) updates.name_hindi = req.body.nameHindi;
    if (req.body.code !== undefined) updates.code = req.body.code.toLowerCase();
    if (req.body.classLevel !== undefined) updates.class_level = Number(req.body.classLevel);
    if (req.body.board !== undefined) updates.board = req.body.board;
    if (req.body.color !== undefined) updates.color = req.body.color;
    if (req.body.icon !== undefined) updates.icon = req.body.icon;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.descriptionHindi !== undefined) updates.description_hindi = req.body.descriptionHindi;

    const { data: subject, error } = await supabaseAdmin
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({
      success: true,
      subject: {
        ...subject,
        _id: subject.id,
        nameHindi: subject.name_hindi,
        classLevel: subject.class_level
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    // On delete cascade removes chapters, lessons, questions
    const { error } = await supabaseAdmin
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Subject and child chapters deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// CHAPTERS CRUD
// =================================================================

exports.createChapter = async (req, res, next) => {
  try {
    const { subjectId, chapterNumber, title, titleHindi, description, descriptionHindi, classLevel, board, language } = req.body;
    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .insert({
        subject_id: subjectId,
        chapter_number: Number(chapterNumber),
        title,
        title_hindi: titleHindi || title,
        description: description || '',
        description_hindi: descriptionHindi || '',
        class_level: Number(classLevel || 10),
        board: board || 'CBSE',
        language: language || 'en'
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({
      success: true,
      chapter: {
        ...chapter,
        _id: chapter.id,
        subjectId: chapter.subject_id,
        chapterNumber: chapter.chapter_number,
        titleHindi: chapter.title_hindi,
        classLevel: chapter.class_level,
        board: chapter.board,
        language: chapter.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.chapterNumber !== undefined) updates.chapter_number = Number(req.body.chapterNumber);
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.titleHindi !== undefined) updates.title_hindi = req.body.titleHindi;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.descriptionHindi !== undefined) updates.description_hindi = req.body.descriptionHindi;
    if (req.body.classLevel !== undefined) updates.class_level = Number(req.body.classLevel);
    if (req.body.board !== undefined) updates.board = req.body.board;
    if (req.body.language !== undefined) updates.language = req.body.language;

    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({
      success: true,
      chapter: {
        ...chapter,
        _id: chapter.id,
        subjectId: chapter.subject_id,
        chapterNumber: chapter.chapter_number,
        titleHindi: chapter.title_hindi,
        classLevel: chapter.class_level,
        board: chapter.board,
        language: chapter.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Chapter and child lessons deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// LESSONS CRUD
// =================================================================

exports.createLesson = async (req, res, next) => {
  try {
    const { chapterId, lessonNumber, title, titleHindi, summary, summaryHindi, contentBlocks, diagramId, classLevel, board, language } = req.body;
    const { data: lesson, error } = await supabaseAdmin
      .from('lessons')
      .insert({
        chapter_id: chapterId,
        lesson_number: Number(lessonNumber),
        title,
        title_hindi: titleHindi || title,
        summary: summary || '',
        summary_hindi: summaryHindi || '',
        content_blocks: contentBlocks || [],
        diagram_id: diagramId || null,
        class_level: Number(classLevel || 10),
        board: board || 'CBSE',
        language: language || 'en'
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({
      success: true,
      lesson: {
        ...lesson,
        _id: lesson.id,
        chapterId: lesson.chapter_id,
        lessonNumber: lesson.lesson_number,
        titleHindi: lesson.title_hindi,
        contentBlocks: lesson.content_blocks,
        classLevel: lesson.class_level,
        board: lesson.board,
        language: lesson.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.lessonNumber !== undefined) updates.lesson_number = Number(req.body.lessonNumber);
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.titleHindi !== undefined) updates.title_hindi = req.body.titleHindi;
    if (req.body.summary !== undefined) updates.summary = req.body.summary;
    if (req.body.summaryHindi !== undefined) updates.summary_hindi = req.body.summaryHindi;
    if (req.body.contentBlocks !== undefined) updates.content_blocks = req.body.contentBlocks;
    if (req.body.diagramId !== undefined) updates.diagram_id = req.body.diagramId || null;
    if (req.body.classLevel !== undefined) updates.class_level = Number(req.body.classLevel);
    if (req.body.board !== undefined) updates.board = req.body.board;
    if (req.body.language !== undefined) updates.language = req.body.language;

    const { data: lesson, error } = await supabaseAdmin
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({
      success: true,
      lesson: {
        ...lesson,
        _id: lesson.id,
        chapterId: lesson.chapter_id,
        lessonNumber: lesson.lesson_number,
        titleHindi: lesson.title_hindi,
        contentBlocks: lesson.content_blocks,
        classLevel: lesson.class_level,
        board: lesson.board,
        language: lesson.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// QUESTIONS CRUD
// =================================================================

exports.getAdminQuestions = async (req, res, next) => {
  try {
    let query = supabaseAdmin
      .from('questions')
      .select(`
        *,
        chapters:chapter_id (
          id,
          chapter_number,
          title,
          title_hindi
        )
      `)
      .order('created_at', { ascending: false });

    if (req.query.chapterId) {
      query = query.eq('chapter_id', req.query.chapterId);
    }

    const { data: questions, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      count: (questions || []).length,
      questions: (questions || []).map(q => ({
        ...q,
        _id: q.id,
        chapterId: q.chapter_id,
        chapter: q.chapters,
        questionText: q.question_text,
        questionTextHindi: q.question_text_hindi,
        correctOptionIndex: q.correct_option_index,
        explanationHindi: q.explanation_hindi
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { chapterId, questionText, questionTextHindi, options, optionsHindi, correctOptionIndex, explanation, explanationHindi, difficulty, classLevel, board, language } = req.body;
    const { data: q, error } = await supabaseAdmin
      .from('questions')
      .insert({
        chapter_id: chapterId,
        question_text: questionText,
        question_text_hindi: questionTextHindi || '',
        options: options || [],
        options_hindi: optionsHindi || [],
        correct_option_index: Number(correctOptionIndex || 0),
        explanation: explanation || '',
        explanation_hindi: explanationHindi || '',
        difficulty: difficulty || 'medium',
        class_level: Number(classLevel || 10),
        board: board || 'CBSE',
        language: language || 'en'
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({
      success: true,
      question: {
        ...q,
        _id: q.id,
        chapterId: q.chapter_id,
        questionText: q.question_text,
        questionTextHindi: q.question_text_hindi,
        correctOptionIndex: q.correct_option_index,
        classLevel: q.class_level,
        board: q.board,
        language: q.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.questionText !== undefined) updates.question_text = req.body.questionText;
    if (req.body.questionTextHindi !== undefined) updates.question_text_hindi = req.body.questionTextHindi;
    if (req.body.options !== undefined) updates.options = req.body.options;
    if (req.body.optionsHindi !== undefined) updates.options_hindi = req.body.optionsHindi;
    if (req.body.correctOptionIndex !== undefined) updates.correct_option_index = Number(req.body.correctOptionIndex);
    if (req.body.explanation !== undefined) updates.explanation = req.body.explanation;
    if (req.body.explanationHindi !== undefined) updates.explanation_hindi = req.body.explanationHindi;
    if (req.body.difficulty !== undefined) updates.difficulty = req.body.difficulty;
    if (req.body.classLevel !== undefined) updates.class_level = Number(req.body.classLevel);
    if (req.body.board !== undefined) updates.board = req.body.board;
    if (req.body.language !== undefined) updates.language = req.body.language;

    const { data: q, error } = await supabaseAdmin
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({
      success: true,
      question: {
        ...q,
        _id: q.id,
        chapterId: q.chapter_id,
        questionText: q.question_text,
        questionTextHindi: q.question_text_hindi,
        correctOptionIndex: q.correct_option_index,
        classLevel: q.class_level,
        board: q.board,
        language: q.language
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// USERS CRUD
// =================================================================

exports.getUsers = async (req, res, next) => {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({
      success: true,
      count: (profiles || []).length,
      users: (profiles || []).map(p => ({
        _id: p.id,
        id: p.id,
        name: p.full_name,
        role: p.role,
        board: p.board,
        classLevel: p.class_level,
        preferredLanguage: p.preferred_language,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'admin', 'mentor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({
      success: true,
      user: {
        _id: profile.id,
        id: profile.id,
        name: profile.full_name,
        role: profile.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
