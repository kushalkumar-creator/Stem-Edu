const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * Format subject row for frontend compatibility
 */
function formatSubject(s) {
  return {
    _id: s.id,
    id: s.id,
    name: s.name,
    nameHindi: s.name_hindi,
    code: s.code,
    description: s.description,
    descriptionHindi: s.description_hindi,
    icon: s.icon,
    color: s.color,
    classLevel: s.class_level,
    board: s.board,
    order: s.order_num,
    createdAt: s.created_at
  };
}

/**
 * Format chapter row for frontend compatibility
 */
function formatChapter(c) {
  return {
    _id: c.id,
    id: c.id,
    subjectId: c.subject_id,
    chapterNumber: c.chapter_number,
    title: c.title,
    titleHindi: c.title_hindi,
    description: c.description,
    descriptionHindi: c.description_hindi,
    classLevel: c.class_level,
    board: c.board,
    order: c.order_num,
    createdAt: c.created_at
  };
}

/**
 * Format lesson row for frontend compatibility
 */
function formatLesson(l) {
  return {
    _id: l.id,
    id: l.id,
    chapterId: l.chapter_id,
    lessonNumber: l.lesson_number,
    title: l.title,
    titleHindi: l.title_hindi,
    summary: l.summary,
    summaryHindi: l.summary_hindi,
    contentBlocks: l.content_blocks || [],
    diagramId: l.diagram_id,
    order: l.order_num,
    createdAt: l.created_at
  };
}

/**
 * GET /api/subjects
 * List subjects filtered by student profile (board, class) or query params
 */
const getSubjects = async (req, res, next) => {
  try {
    const board = req.query.board || (req.user && req.user.board) || 'CBSE';
    const classLevel = req.query.class || req.query.classLevel || (req.user && req.user.classLevel) || 10;

    let query = supabaseAdmin
      .from('subjects')
      .select('*')
      .order('order_num', { ascending: true });

    if (board) query = query.eq('board', board);
    if (classLevel) query = query.eq('class_level', Number(classLevel));

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json((data || []).map(formatSubject));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subjects/:id/chapters
 * List chapters for a subject filtered by student profile (board, class)
 */
const getSubjectChapters = async (req, res, next) => {
  try {
    const subjectId = req.params.id;
    const board = req.query.board || (req.user && req.user.board) || 'CBSE';
    const classLevel = req.query.class || req.query.classLevel || (req.user && req.user.classLevel) || 10;

    let query = supabaseAdmin
      .from('chapters')
      .select('*')
      .eq('subject_id', subjectId)
      .order('chapter_number', { ascending: true });

    if (board) query = query.eq('board', board);
    if (classLevel) query = query.eq('class_level', Number(classLevel));

    const { data: chapters, error } = await query;
    if (error) throw error;

    let formattedChapters = (chapters || []).map(formatChapter);

    // If user is authenticated, attach completion percentage for each chapter
    if (req.user && formattedChapters.length > 0) {
      const chapterIds = formattedChapters.map(c => c.id);
      const { data: progressRows } = await supabaseAdmin
        .from('progress')
        .select('chapter_id, completion_percentage')
        .eq('user_id', req.user.id)
        .in('chapter_id', chapterIds);

      const progressMap = {};
      (progressRows || []).forEach(p => {
        progressMap[p.chapter_id] = p.completion_percentage;
      });

      formattedChapters = formattedChapters.map(c => ({
        ...c,
        completionPercentage: progressMap[c.id] || 0
      }));
    }

    res.status(200).json(formattedChapters);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chapters/:id/lessons
 * List all lessons in a chapter in sequence
 */
const getChapterLessons = async (req, res, next) => {
  try {
    const chapterId = req.params.id;

    const { data: lessons, error } = await supabaseAdmin
      .from('lessons')
      .select('id, chapter_id, lesson_number, title, title_hindi, order_num, diagram_id')
      .eq('chapter_id', chapterId)
      .order('lesson_number', { ascending: true });

    if (error) throw error;

    let formattedLessons = (lessons || []).map(formatLesson);

    if (req.user && formattedLessons.length > 0) {
      const { data: progress } = await supabaseAdmin
        .from('progress')
        .select('completed_lessons')
        .eq('user_id', req.user.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      const completedSet = new Set((progress?.completed_lessons || []).map(String));

      formattedLessons = formattedLessons.map(l => ({
        ...l,
        isCompleted: completedSet.has(String(l.id))
      }));
    }

    res.status(200).json(formattedLessons);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lessons/:id
 * Fetch single lesson details with its content blocks (text, image, formula, diagram)
 */
const getLessonById = async (req, res, next) => {
  try {
    const { data: lesson, error } = await supabaseAdmin
      .from('lessons')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Update bookmark in progress if user is authenticated
    if (req.user) {
      const { data: existingProgress } = await supabaseAdmin
        .from('progress')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('chapter_id', lesson.chapter_id)
        .maybeSingle();

      if (existingProgress) {
        await supabaseAdmin
          .from('progress')
          .update({
            last_accessed_lesson_id: lesson.id,
            last_accessed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        await supabaseAdmin
          .from('progress')
          .insert({
            user_id: req.user.id,
            chapter_id: lesson.chapter_id,
            last_accessed_lesson_id: lesson.id,
            last_accessed_at: new Date().toISOString()
          });
      }
    }

    res.status(200).json(formatLesson(lesson));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubjectChapters,
  getChapterLessons,
  getLessonById
};
