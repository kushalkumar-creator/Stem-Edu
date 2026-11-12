const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { virtualTopicsData } = require('../data/virtualTopicsData');

/**
 * List all virtual learning topics with filtering & student progress
 * GET /api/virtual
 */
exports.getTopics = async (req, res) => {
  try {
    const { subject, classLevel, board = 'CBSE' } = req.query;
    const userId = req.user ? req.user.id : null;

    let topics = [...virtualTopicsData];

    // Try fetching from database if table exists
    if (supabaseAdmin) {
      try {
        let dbQuery = supabaseAdmin
          .from('virtual_topics')
          .select('*')
          .eq('status', 'published');

        if (subject) dbQuery = dbQuery.eq('subject', subject);
        if (classLevel) dbQuery = dbQuery.eq('class_level', Number(classLevel));
        if (board) dbQuery = dbQuery.eq('board', board);

        const { data: dbTopics, error } = await dbQuery;
        if (!error && dbTopics && dbTopics.length > 0) {
          topics = dbTopics;
        }
      } catch (_) {
        // Fallback to static seed data
      }
    }

    // Apply in-memory filters if needed
    if (subject) {
      topics = topics.filter(t => t.subject === subject);
    }
    if (classLevel) {
      topics = topics.filter(t => t.class_level === Number(classLevel));
    }

    // Load user completion if authenticated
    let progressMap = {};
    if (userId && supabaseAdmin) {
      try {
        const { data: progress } = await supabaseAdmin
          .from('topic_progress')
          .select('topic_id, completed, score')
          .eq('user_id', userId);

        if (progress) {
          progress.forEach(p => {
            progressMap[p.topic_id] = p;
          });
        }
      } catch (_) {}
    }

    const decorated = topics.map(t => ({
      ...t,
      completed: !!progressMap[t.id || t.slug]?.completed,
      score: progressMap[t.id || t.slug]?.score || 0
    }));

    return res.json({
      success: true,
      count: decorated.length,
      data: decorated
    });
  } catch (err) {
    console.error('Get virtual topics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch virtual topics', error: err.message });
  }
};

/**
 * Get single topic by slug with simulation configuration and quiz
 * GET /api/virtual/:slug
 */
exports.getTopicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check seed data first
    let topic = virtualTopicsData.find(t => t.slug === slug);

    if (!topic && supabaseAdmin) {
      const { data: dbTopic } = await supabaseAdmin
        .from('virtual_topics')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (dbTopic) topic = dbTopic;
    }

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Virtual topic not found' });
    }

    return res.json({
      success: true,
      data: topic
    });
  } catch (err) {
    console.error('Get topic by slug error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch topic details', error: err.message });
  }
};

/**
 * Record student progress and quiz score for a topic
 * POST /api/virtual/:slug/progress
 */
exports.recordProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slug } = req.params;
    const { score = 100, completed = true } = req.body;

    const topic = virtualTopicsData.find(t => t.slug === slug);
    const topicId = topic ? (topic.id || slug) : slug;

    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from('topic_progress')
          .upsert({
            user_id: userId,
            topic_id: topicId,
            completed,
            score: Number(score),
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id, topic_id' });
      } catch (err) {
        console.warn('Could not persist topic progress to DB:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Progress recorded successfully',
      topicSlug: slug,
      score,
      completed
    });
  } catch (err) {
    console.error('Record progress error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record progress', error: err.message });
  }
};

