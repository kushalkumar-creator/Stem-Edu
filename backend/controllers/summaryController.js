const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { generateSummary } = require('../utils/gemini');
const { retrieve } = require('../src/rag/retrieval');

const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';

/**
 * Phase 1 backward-compatible lesson summary
 * POST /api/lessons/:id/summary
 */
exports.getLessonSummary = async (req, res, next) => {
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

/**
 * Advanced Multi-style Summarizer & Flashcards Engine (P2-4)
 * POST /api/summaries/generate
 */
exports.generateAdvancedSummary = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      source = 'lesson', // 'lesson' | 'chapter' | 'notes' | 'custom'
      sourceId,
      rawText,
      title = 'Study Summary',
      length = 'short', // 'short' (5 bullets) | 'medium' (1-2 paras) | 'detailed' (full sheet)
      style = 'bullets', // 'bullets' | 'formulas' | 'simplified'
      language = 'en',
      classLevel = 10
    } = req.body;

    let textToSummarize = rawText || '';

    // Fetch source text if not provided directly
    if (!textToSummarize && sourceId) {
      if (source === 'lesson') {
        const { data: lesson } = await supabaseAdmin
          .from('lessons')
          .select('title, summary, content_blocks')
          .eq('id', sourceId)
          .maybeSingle();

        if (lesson) {
          const blocks = (lesson.content_blocks || []).map(b => typeof b === 'string' ? b : (b.content || '')).join('\n\n');
          textToSummarize = `${lesson.title}\n\n${lesson.summary || ''}\n\n${blocks}`;
        }
      } else if (source === 'chapter') {
        // Retrieve RAG chunks for chapter
        const chunks = await retrieve(title, { classLevel, minSimilarity: 0.1 }, 6);
        textToSummarize = chunks.map(c => c.content).join('\n\n');
      }
    }

    if (!textToSummarize || !textToSummarize.trim()) {
      textToSummarize = `${title}: Key principles and standard derivations for CBSE Class ${classLevel}.`;
    }

    // Build custom prompt based on style & length
    const styleInstruction = style === 'formulas'
      ? 'Focus EXCLUSIVELY on mathematical formulas, chemical equations, SI units, and core definitions with parameter labels.'
      : style === 'simplified'
      ? 'Explain like I am in Class 8: Use vivid real-life analogies, intuitive reasoning, and zero dense jargon.'
      : 'Provide clear, structured high-yield revision bullet points.';

    const lengthInstruction = length === 'short'
      ? 'Produce exactly 5 high-impact bullet points.'
      : length === 'detailed'
      ? 'Provide a comprehensive 3-part study sheet: 1. Core Principles, 2. Derivations & Formulas, 3. CBSE Exam Pitfalls.'
      : 'Produce a 2-paragraph summary followed by 3 key highlights.';

    const langInstruction = language === 'hi'
      ? 'उत्तर शुद्ध और सरल हिंदी (Devanagari script) में दीजिए।'
      : language === 'mr'
      ? 'उत्तर सोप्या आणि अचूक मराठीत (Devanagari script) द्या.'
      : 'Respond in clear, encouraging English.';

    const prompt = `You are an expert CBSE STEM tutor.
Summarize the following educational material.

LANGUAGE: ${langInstruction}
STYLE: ${styleInstruction}
LENGTH: ${lengthInstruction}

MATERIAL TO SUMMARIZE:
"""
${textToSummarize.slice(0, 6000)}
"""

Also provide 5 active-recall FLASHCARDS based on this text in the following JSON format at the very end of your response, wrapped inside \`\`\`json:
\`\`\`json
[
  { "front": "Question / Prompt", "back": "Answer / Formula" }
]
\`\`\`
`;

    let generatedText = '';
    let flashcards = [];

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent(prompt);
        const responseText = (await result.response).text();

        // Parse flashcards if JSON block exists
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
        if (jsonMatch) {
          try {
            flashcards = JSON.parse(jsonMatch[1].trim());
            generatedText = responseText.replace(/```json[\s\S]*?```/, '').trim();
          } catch (_) {
            generatedText = responseText;
          }
        } else {
          generatedText = responseText;
        }
      } catch (geminiErr) {
        console.warn('Gemini summary call error:', geminiErr.message);
      }
    }

    // Local synthesizer fallback if offline or no key
    if (!generatedText) {
      generatedText = synthesizeFallbackSummary(title, textToSummarize, length, style, language, classLevel);
      flashcards = synthesizeFallbackFlashcards(title, style);
    }

    // Cache summary in Supabase if table exists
    let summaryId = null;
    if (userId && supabaseAdmin) {
      try {
        const { data: saved } = await supabaseAdmin
          .from('summaries')
          .insert({
            user_id: userId,
            source,
            source_id: sourceId || null,
            title,
            options: { length, style, language, classLevel },
            text: generatedText,
            flashcards
          })
          .select('id')
          .single();

        if (saved) summaryId = saved.id;
      } catch (_) {}
    }

    return res.json({
      success: true,
      id: summaryId,
      title,
      summary: generatedText,
      flashcards,
      options: { length, style, language }
    });

  } catch (err) {
    console.error('Advanced summary error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate summary', error: err.message });
  }
};

/**
 * List saved summaries for user
 * GET /api/summaries
 */
exports.getSavedSummaries = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!supabaseAdmin) {
      return res.json({ success: true, data: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ success: true, data: [] });
    }

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error('Get saved summaries error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch summaries', error: err.message });
  }
};

/**
 * Delete a saved summary
 * DELETE /api/summaries/:id
 */
exports.deleteSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (supabaseAdmin) {
      await supabaseAdmin
        .from('summaries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    }

    return res.json({
      success: true,
      message: 'Summary deleted'
    });
  } catch (err) {
    console.error('Delete summary error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete summary', error: err.message });
  }
};

function synthesizeFallbackSummary(title, text, length, style, lang, classLevel) {
  if (style === 'formulas') {
    return `### 📐 Key Formulas & Equations: ${title}

1. **Governing Law / Formula:** Defined across CBSE Class ${classLevel} syllabus for standard numerical computation.
2. **Standard SI Units:** Verify all parameters are converted to MKS units before calculation.
3. **Important Relationships:** Proportionalities and constant multipliers must be explicitly written for full marks.`;
  }

  if (style === 'simplified') {
    return `### 💡 Intuitive Analogy: ${title}

Imagine this concept like a simple everyday flow:
- Think of the driving force like water pressure pushing through a pipe.
- Obstacles in the path act as resistance, slowing down the movement.
- When you increase the force, the flow speeds up proportionally! This is exactly how the governing scientific principle works.`;
  }

  return `### 📋 Quick Revision Summary: ${title} (CBSE Class ${classLevel})

1. **Foundational Principle:** ${text.slice(0, 160).replace(/\n/g, ' ')}...
2. **Key CBSE Board Highlight:** Always define the standard parameters before performing algebraic derivations.
3. **Exam Tip:** Draw neat, labeled diagrams with directional arrows to secure complete presentation marks.`;
}

function synthesizeFallbackFlashcards(title, style) {
  return [
    { front: `What is the core definition of ${title}?`, back: "State the standard CBSE definition with appropriate SI units." },
    { front: `What are the governing equations in ${title}?`, back: "Write down the algebraic formula and identify every variable." },
    { front: `What common mistake do students make in ${title}?`, back: "Forgetting to convert units to SI or omitting the sign convention." },
    { front: `State one real-world application of ${title}.`, back: "Used in modern engineering, instrumentation, and biological regulation." },
    { front: `What is the standard CBSE mark allocation for derivations?`, back: "1 mark for formula, 1 mark for substitution, 1 mark for final answer with units." }
  ];
}
