const { supabaseAdmin } = require('../utils/supabaseAdmin');

function formatLab(l, isAdmin = false) {
  const quiz = l.quiz || [];
  const observationQuestions = quiz.map((q, idx) => {
    const formatted = {
      _id: q._id || `q_${idx}`,
      id: q.id || `q_${idx}`,
      question: q.question,
      questionHindi: q.questionHindi,
      options: q.options || [],
      optionsHindi: q.optionsHindi || []
    };
    if (isAdmin) {
      formatted.correctIndex = q.correctIndex;
      formatted.explanation = q.explanation;
    }
    return formatted;
  });

  return {
    _id: l.id,
    id: l.id,
    title: l.title,
    titleHindi: l.title_hindi,
    experimentType: l.experiment_type,
    description: l.description,
    descriptionHindi: l.description_hindi,
    instructions: l.instructions || [],
    instructionsHindi: l.instructions_hindi || [],
    variables: l.variables || [],
    observationQuestions,
    quiz: l.quiz || [],
    subjectId: l.subjects ? {
      _id: l.subjects.id,
      id: l.subjects.id,
      name: l.subjects.name,
      nameHindi: l.subjects.name_hindi,
      code: l.subjects.code,
      color: l.subjects.color
    } : l.subject_id,
    createdAt: l.created_at
  };
}

/**
 * GET /api/labs
 * Retrieve list of all virtual labs
 */
exports.getAllLabs = async (req, res, next) => {
  try {
    let query = supabaseAdmin
      .from('labs')
      .select(`
        *,
        subjects:subject_id (
          id, name, name_hindi, code, color
        )
      `)
      .order('created_at', { ascending: true });

    if (req.query.experimentType) {
      query = query.eq('experiment_type', req.query.experimentType);
    }
    if (req.query.subjectId) {
      query = query.eq('subject_id', req.query.subjectId);
    }

    const { data: labs, error } = await query;
    if (error) throw error;

    const formattedLabs = (labs || []).map(l => formatLab(l, false));

    res.json({
      success: true,
      count: formattedLabs.length,
      labs: formattedLabs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/labs/:id
 * Retrieve a specific lab by UUID or experimentType identifier
 */
exports.getLabByIdOrType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabaseAdmin
      .from('labs')
      .select(`
        *,
        subjects:subject_id (
          id, name, name_hindi, code, color
        )
      `);

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      const norm = id === 'pendulum' ? 'simple_pendulum' : id;
      query = query.eq('experiment_type', norm);
    }

    const { data: lab, error } = await query.maybeSingle();
    if (error) throw error;

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: `Virtual lab '${id}' not found`
      });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    res.json({
      success: true,
      lab: formatLab(lab, isAdmin)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/labs/:id/submit
 * Submit end-of-lab observation quiz and record student result
 */
exports.submitLabQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers, simulationConfig } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission: answers array is required'
      });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabaseAdmin.from('labs').select('*');

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      const norm = id === 'pendulum' ? 'simple_pendulum' : id;
      query = query.eq('experiment_type', norm);
    }

    const { data: lab, error: labErr } = await query.maybeSingle();
    if (labErr) throw labErr;
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: `Virtual lab '${id}' not found`
      });
    }

    const quiz = lab.quiz || [];
    const totalQuestions = quiz.length;
    let score = 0;
    const evaluatedAnswers = [];

    quiz.forEach((q, idx) => {
      const selectedIndex = answers[idx];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) score += 1;

      evaluatedAnswers.push({
        questionIndex: idx,
        questionText: q.question,
        selectedOptionIndex: selectedIndex !== undefined ? selectedIndex : -1,
        correctOptionIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= 60;

    // Save student lab result if user is authenticated
    let savedResultId = null;
    if (req.user && req.user.id) {
      const { data: savedResult, error: saveErr } = await supabaseAdmin
        .from('lab_results')
        .insert({
          user_id: req.user.id,
          lab_id: lab.id,
          score,
          total_questions: totalQuestions,
          percentage,
          passed,
          answers: evaluatedAnswers,
          simulation_config: simulationConfig || {}
        })
        .select('id')
        .single();

      if (!saveErr && savedResult) {
        savedResultId = savedResult.id;
      }
    }

    res.json({
      success: true,
      resultId: savedResultId,
      score,
      totalQuestions,
      percentage,
      passed,
      evaluatedAnswers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/labs/results/me
 * Get current user's past lab test results
 */
exports.getMyLabResults = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { data: results, error } = await supabaseAdmin
      .from('lab_results')
      .select(`
        *,
        labs:lab_id (
          id, title, title_hindi, experiment_type
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    const formatted = (results || []).map(r => ({
      _id: r.id,
      id: r.id,
      userId: r.user_id,
      labId: r.labs ? {
        _id: r.labs.id,
        id: r.labs.id,
        title: r.labs.title,
        titleHindi: r.labs.title_hindi,
        experimentType: r.labs.experiment_type
      } : r.lab_id,
      score: r.score,
      totalQuestions: r.total_questions,
      percentage: r.percentage,
      passed: r.passed,
      answers: r.answers || [],
      simulationConfig: r.simulation_config || {},
      createdAt: r.created_at
    }));

    res.json({
      success: true,
      count: formatted.length,
      results: formatted
    });
  } catch (error) {
    next(error);
  }
};
