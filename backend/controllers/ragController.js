const { retrieve } = require('../src/rag/retrieval');
const { generateAnswer } = require('../src/rag/generator');
const { chunkText } = require('../src/rag/chunker');
const { getEmbedding } = require('../src/rag/embeddings');
const { supabaseAdmin } = require('../utils/supabaseAdmin');

/**
 * Handle student query via RAG pipeline
 * POST /api/rag/query
 */
exports.queryKnowledgeBase = async (req, res) => {
  try {
    const { query, subject, classLevel = 10, board = 'CBSE', language = 'en' } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const userId = req.user ? req.user.id : null;
    const filters = {
      board,
      classLevel: Number(classLevel),
      subject: subject || null,
      language,
      userId,
      minSimilarity: 0.35
    };

    // 1. Retrieve top matching chunks
    const chunks = await retrieve(query, filters, 5);

    // 2. Generate grounded answer
    const { answer, sources, model } = await generateAnswer(query, chunks, {
      board,
      classLevel: Number(classLevel),
      language
    });

    return res.json({
      success: true,
      query,
      answer,
      sources,
      chunksCount: chunks.length,
      model
    });
  } catch (err) {
    console.error('RAG query error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process RAG query', error: err.message });
  }
};

/**
 * Upload student private notes into vector store (P2-2.7)
 * POST /api/rag/notes
 */
exports.uploadStudentNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, subject, classLevel = 10, board = 'CBSE' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Note content is required' });
    }

    const metadata = {
      board,
      classLevel: Number(classLevel),
      class_level: Number(classLevel),
      subject: subject || 'General Notes',
      chapter: title || 'Student Note',
      source: 'Student Personal Upload',
      type: 'notes',
      userId
    };

    const chunks = chunkText(content, metadata, 1000, 150);
    let insertedCount = 0;

    for (const c of chunks) {
      const { embedding, model } = await getEmbedding(c.content);

      const payload = {
        content: c.content,
        content_hash: c.contentHash,
        embedding,
        embedding_model: model,
        board,
        class_level: Number(classLevel),
        subject: metadata.subject,
        chapter: metadata.chapter,
        source: metadata.source,
        type: 'notes',
        user_id: userId,
        page: 1,
        language: 'en'
      };

      const { error } = await supabaseAdmin.from('chunks').upsert(payload, { onConflict: 'content_hash' });
      if (!error) insertedCount++;
    }

    return res.status(201).json({
      success: true,
      message: 'Notes successfully processed and embedded into your private knowledge base.',
      chunksCreated: insertedCount
    });
  } catch (err) {
    console.error('Upload note error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload notes', error: err.message });
  }
};

/**
 * List student's private notes
 * GET /api/rag/notes
 */
exports.getStudentNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('chunks')
      .select('id, chapter, content, subject, class_level, board, created_at')
      .eq('user_id', userId)
      .eq('type', 'notes')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error('Get student notes error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch notes', error: err.message });
  }
};

/**
 * Delete a private note chunk
 * DELETE /api/rag/notes/:id
 */
exports.deleteStudentNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('chunks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Note deleted from knowledge base'
    });
  } catch (err) {
    console.error('Delete student note error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete note', error: err.message });
  }
};
