const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { generateSummary } = require('../utils/gemini');

/**
 * POST /api/lessons/:id/summary
 * Generates or retrieves cached AI summary for a lesson in the student's language.
 */
const getLessonSummary = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const requestedLang = req.body.language || (req.user && req.user.preferredLanguage) || (req.user && req.user.language) || 'en';
    const langKey = requestedLang === 'hi' ? 'hi' : 'en';

    // 1. Fetch lesson
    const { data: lesson, error } = await supabaseAdmin
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle();

    if (error) throw error;
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // 2. Check cached summary
    const cached = langKey === 'hi' ? lesson.summary_hindi : lesson.summary;
    if (cached && cached.trim().length > 20) {
      return res.status(200).json({
        lessonId: lesson.id,
        language: langKey,
        summary: cached,
        isCached: true,
        source: 'supabase_cache'
      });
    }

    // 3. Format lesson for generateSummary
    const lessonObj = {
      title: lesson.title,
      titleHindi: lesson.title_hindi,
      contentBlocks: lesson.content_blocks || []
    };

    const { summary, source } = await generateSummary(lessonObj, langKey);

    // 4. Cache in database
    const updateField = langKey === 'hi' ? { summary_hindi: summary } : { summary: summary };
    await supabaseAdmin
      .from('lessons')
      .update(updateField)
      .eq('id', lesson.id);

    res.status(200).json({
      lessonId: lesson.id,
      language: langKey,
      summary,
      isCached: false,
      source
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonSummary
};
