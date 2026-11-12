const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * POST /api/lessons/:id/complete
 * Mark a lesson as complete for the student and recalculate chapter percentage
 */
const completeLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.id;

    // 1. Find the lesson to get its chapter_id
    const { data: lesson, error: lessonErr } = await supabaseAdmin
      .from('lessons')
      .select('id, chapter_id')
      .eq('id', lessonId)
      .maybeSingle();

    if (lessonErr) throw lessonErr;
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const chapterId = lesson.chapter_id;

    // 2. Count total lessons belonging to this chapter
    const { count: totalLessons, error: countErr } = await supabaseAdmin
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', chapterId);

    if (countErr) throw countErr;

    // 3. Find existing progress document for this user & chapter
    const { data: existingProgress, error: progErr } = await supabaseAdmin
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .maybeSingle();

    if (progErr) throw progErr;

    let completedLessons = existingProgress?.completed_lessons || [];
    if (!completedLessons.includes(String(lesson.id))) {
      completedLessons.push(String(lesson.id));
    }

    const completedCount = completedLessons.length;
    const totalCount = totalLessons || completedCount || 1;
    const percentage = Math.round((completedCount / totalCount) * 100);

    const progressPayload = {
      user_id: userId,
      chapter_id: chapterId,
      completed_lessons: completedLessons,
      total_lessons_count: totalCount,
      completion_percentage: percentage,
      last_accessed_lesson_id: lesson.id,
      last_accessed_at: new Date().toISOString()
    };

    let savedProgress;
    if (existingProgress) {
      const { data, error: updateErr } = await supabaseAdmin
        .from('progress')
        .update(progressPayload)
        .eq('id', existingProgress.id)
        .select('*')
        .single();
      if (updateErr) throw updateErr;
      savedProgress = data;
    } else {
      const { data, error: insertErr } = await supabaseAdmin
        .from('progress')
        .insert(progressPayload)
        .select('*')
        .single();
      if (insertErr) throw insertErr;
      savedProgress = data;
    }

    res.status(200).json({
      message: 'Lesson marked complete',
      chapterId,
      completedLessonsCount: completedCount,
      totalLessonsCount: totalCount,
      completionPercentage: percentage,
      progress: {
        _id: savedProgress.id,
        id: savedProgress.id,
        userId: savedProgress.user_id,
        chapterId: savedProgress.chapter_id,
        completedLessons: savedProgress.completed_lessons,
        totalLessonsCount: savedProgress.total_lessons_count,
        completionPercentage: savedProgress.completion_percentage,
        lastAccessedLessonId: savedProgress.last_accessed_lesson_id,
        lastAccessedAt: savedProgress.last_accessed_at
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress
 * Get student's overall progress across all chapters
 */
const getProgress = async (req, res, next) => {
  try {
    const { data: progressList, error } = await supabaseAdmin
      .from('progress')
      .select(`
        id,
        user_id,
        chapter_id,
        completed_lessons,
        total_lessons_count,
        completion_percentage,
        last_accessed_lesson_id,
        last_accessed_at,
        chapters:chapter_id (
          id,
          chapter_number,
          title,
          title_hindi,
          subject_id
        ),
        lessons:last_accessed_lesson_id (
          id,
          lesson_number,
          title,
          title_hindi
        )
      `)
      .eq('user_id', req.user.id)
      .order('last_accessed_at', { ascending: false });

    if (error) throw error;

    const formattedList = (progressList || []).map(p => ({
      _id: p.id,
      id: p.id,
      userId: p.user_id,
      chapterId: p.chapters ? {
        _id: p.chapters.id,
        id: p.chapters.id,
        chapterNumber: p.chapters.chapter_number,
        title: p.chapters.title,
        titleHindi: p.chapters.title_hindi,
        subjectId: p.chapters.subject_id
      } : p.chapter_id,
      completedLessons: p.completed_lessons || [],
      totalLessonsCount: p.total_lessons_count,
      completionPercentage: p.completion_percentage,
      lastAccessedLessonId: p.lessons ? {
        _id: p.lessons.id,
        id: p.lessons.id,
        lessonNumber: p.lessons.lesson_number,
        title: p.lessons.title,
        titleHindi: p.lessons.title_hindi
      } : p.last_accessed_lesson_id,
      lastAccessedAt: p.last_accessed_at
    }));

    res.status(200).json(formattedList);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completeLesson,
  getProgress
};
