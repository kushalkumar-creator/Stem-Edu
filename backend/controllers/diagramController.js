const { supabaseAdmin } = require('../utils/supabaseAdmin');

function formatDiagram(d) {
  return {
    _id: d.id,
    id: d.id,
    title: d.title,
    titleHindi: d.title_hindi,
    subjectCode: d.subject_code,
    svgViewBox: d.svg_viewbox,
    elements: d.elements || [],
    createdAt: d.created_at
  };
}

/**
 * GET /api/diagrams
 * List all available interactive diagrams
 */
const getDiagrams = async (req, res, next) => {
  try {
    let query = supabaseAdmin
      .from('diagrams')
      .select('*')
      .order('created_at', { ascending: true });

    if (req.query.subject) {
      query = query.eq('subject_code', req.query.subject.toLowerCase());
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json((data || []).map(formatDiagram));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/diagrams/:id
 * Fetch single diagram with all SVG elements, coordinates, and explanations
 */
const getDiagramById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Check UUID regex
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabaseAdmin.from('diagrams').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('subject_code', id.toLowerCase());
    }

    const { data: diagram, error } = await query.maybeSingle();
    if (error) throw error;

    if (!diagram) {
      return res.status(404).json({ message: 'Diagram not found' });
    }

    res.status(200).json(formatDiagram(diagram));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiagrams,
  getDiagramById
};
