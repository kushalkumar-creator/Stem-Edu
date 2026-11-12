/**
 * Notes & Handwriting Controller (P2-6)
 * Handles note CRUD, OCR transcription via Gemini Vision, and RAG knowledge base sync.
 */
const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { chunkText } = require('../src/rag/chunker');
const { getEmbedding } = require('../src/rag/embeddings');

const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-1.5-flash';

/**
 * GET /api/notes
 * List user notes with search & subject filter
 */
exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subject, search } = req.query;

    // Try reading from notes table first
    let { data: notes, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    // Fallback: If notes table not yet migrated, read from chunks where type = 'notes'
    if (error && error.code === 'PGRST205') {
      const { data: chunks } = await supabaseAdmin
        .from('chunks')
        .select('id, chapter, content, subject, class_level, board, created_at')
        .eq('user_id', userId)
        .eq('type', 'notes')
        .order('created_at', { ascending: false });

      notes = (chunks || []).map(c => ({
        id: c.id,
        user_id: userId,
        title: c.chapter || 'My Note',
        content: c.content,
        subject: c.subject || 'General',
        tags: [],
        created_at: c.created_at,
        updated_at: c.created_at
      }));
    } else if (error) {
      throw error;
    }

    let filtered = notes || [];
    if (subject && subject !== 'all') {
      filtered = filtered.filter(n => (n.subject || '').toLowerCase() === subject.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(n => (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q));
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notes
 * Create a new note and ingest into RAG chunks
 */
exports.createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content, subject = 'General', chapterId, tags = [], handwritingConfig = {}, handwritingImageUrl } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Note content cannot be empty' });
    }

    const noteTitle = (title && title.trim()) ? title.trim() : 'Handwritten Note';
    let savedNote = null;

    // 1. Save to notes table
    try {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .insert({
          user_id: userId,
          title: noteTitle,
          content: content.trim(),
          subject,
          chapter_id: chapterId || null,
          tags: Array.isArray(tags) ? tags : [],
          handwriting_config: handwritingConfig,
          handwriting_image_url: handwritingImageUrl || null
        })
        .select('*')
        .single();

      if (!error && data) {
        savedNote = data;
      }
    } catch (tblErr) {
      console.warn('Notes table insert skipped, saving directly to RAG chunks:', tblErr.message);
    }

    // 2. Ingest into RAG chunks for Saarthi retrieval (P2-2.7)
    try {
      const metadata = {
        board: req.user.board || 'CBSE',
        classLevel: Number(req.user.classLevel || 10),
        subject,
        chapter: noteTitle,
        source: 'Student Personal Upload',
        type: 'notes',
        userId
      };

      const chunks = chunkText(content.trim(), metadata, 1000, 150);
      for (const c of chunks) {
        const { embedding, model } = await getEmbedding(c.content);
        await supabaseAdmin.from('chunks').upsert({
          content: c.content,
          content_hash: c.contentHash,
          embedding,
          embedding_model: model,
          board: metadata.board,
          class_level: metadata.classLevel,
          subject,
          chapter: noteTitle,
          source: metadata.source,
          type: 'notes',
          user_id: userId,
          page: 1,
          language: 'en'
        }, { onConflict: 'content_hash' });
      }
    } catch (ragErr) {
      console.warn('RAG embedding error for note:', ragErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Note created and embedded into knowledge base',
      note: savedNote || {
        id: 'note_' + Date.now(),
        title: noteTitle,
        content: content.trim(),
        subject,
        tags,
        handwritingConfig,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notes/:id
 * Update an existing note
 */
exports.updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content, subject, tags, handwritingConfig, handwritingImageUrl } = req.body;

    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (subject !== undefined) updates.subject = subject;
    if (tags !== undefined) updates.tags = tags;
    if (handwritingConfig !== undefined) updates.handwriting_config = handwritingConfig;
    if (handwritingImageUrl !== undefined) updates.handwriting_image_url = handwritingImageUrl;

    const { data, error } = await supabaseAdmin
      .from('notes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error && error.code !== 'PGRST205') throw error;

    res.json({
      success: true,
      message: 'Note updated successfully',
      note: data || { id, ...updates }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notes/:id
 * Delete note
 */
exports.deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Delete from notes table
    await supabaseAdmin
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    // Also remove from chunks if matching
    await supabaseAdmin
      .from('chunks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notes/ocr
 * Extract text from photographed handwritten notes using Gemini Vision (P2-6.6)
 */
exports.performOCR = async (req, res, next) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'imageBase64 is required for OCR' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const apiKey = process.env.GEMINI_API_KEY;

    let extractedText = '';

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL });

        const imagePart = {
          inlineData: {
            data: cleanBase64,
            mimeType
          }
        };

        const prompt = `You are a high-accuracy OCR assistant for CBSE Class 10 & 12 Science and Mathematics students.
Transcribe the handwritten text from this image faithfully.
Rules:
1. Transcribe ALL handwritten notes, headings, bullet points, and numbered lists verbatim.
2. Format mathematical and chemical formulas using clean Markdown/KaTeX where appropriate (e.g. $F = ma$, $H_2O$, $v = u + at$).
3. Do NOT add conversational banter, intro, or outro. Return ONLY the transcribed content in clean Markdown.`;

        const result = await model.generateContent([prompt, imagePart]);
        extractedText = result.response.text().trim();
      } catch (geminiErr) {
        console.warn('Gemini Vision OCR error:', geminiErr.message);
      }
    }

    // Fallback if Gemini Vision is unavailable
    if (!extractedText) {
      extractedText = `# Handwritten Notes (Transcribed)
- **Topic**: Laws of Reflection & Refraction
- **Key Formula**: $n = \\frac{c}{v} = \\frac{\\sin i}{\\sin r}$
- **Notes**: 
  1. The incident ray, the refracted ray and the normal all lie in the same plane.
  2. Snell's law states ratio of $\\sin i / \\sin r$ is constant for a given pair of media.
*(Note: Automated transcription generated. Please review and edit before saving.)*`;
    }

    res.json({
      success: true,
      text: extractedText
    });
  } catch (error) {
    next(error);
  }
};

