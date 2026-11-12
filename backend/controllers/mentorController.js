const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { getSaarthiSystemPrompt } = require('../src/mentor/systemPrompt');
const { getStudentMemories, extractAndStoreFacts } = require('../src/mentor/memoryService');
const { retrieve } = require('../src/rag/retrieval');

const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';

/**
 * Create a new chat session
 * POST /api/mentor/sessions
 */
exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title = 'New Doubt Discussion', mode = 'doubt', subject = 'physics' } = req.body;

    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
        mode,
        subject
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Create session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create session', error: err.message });
  }
};

/**
 * List all sessions for the logged-in student
 * GET /api/mentor/sessions
 */
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch sessions', error: err.message });
  }
};

/**
 * Get messages of a specific session
 * GET /api/mentor/sessions/:id
 */
exports.getSessionMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify session ownership
    const { data: session, error: sessErr } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (sessErr || !session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (msgErr) throw msgErr;

    return res.json({
      success: true,
      session,
      messages: messages || []
    });
  } catch (err) {
    console.error('Get session messages error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
};

/**
 * Delete a session
 * DELETE /api/mentor/sessions/:id
 */
exports.deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (err) {
    console.error('Delete session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete session', error: err.message });
  }
};

/**
 * Send a message and receive Saarthi's intelligent response
 * POST /api/mentor/sessions/:id/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: sessionId } = req.params;
    const { content, mode: clientMode, subject: clientSubj, classLevel = 10, language = 'en' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // 1. Fetch and verify session
    const { data: session, error: sErr } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (sErr || !session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const activeMode = clientMode || session.mode || 'doubt';
    const activeSubject = clientSubj || session.subject || 'physics';

    // 2. Save user message to database
    const { data: userMsg, error: uErr } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        content: content.trim(),
        sources: []
      })
      .select()
      .single();

    if (uErr) throw uErr;

    // 3. Fetch past conversation context (last 6 messages)
    const { data: history } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(6);

    const reversedHistory = (history || []).reverse();

    // 4. Retrieve RAG chunks from knowledge store
    const retrievedChunks = await retrieve(content, {
      board: 'CBSE',
      classLevel: Number(classLevel),
      subject: activeSubject,
      language,
      userId,
      minSimilarity: 0.15
    }, 3);

    // 5. Retrieve student memories
    const memories = await getStudentMemories(userId, activeSubject);

    // 6. Build prompt
    const systemPrompt = getSaarthiSystemPrompt({
      mode: activeMode,
      board: 'CBSE',
      classLevel: Number(classLevel),
      language,
      studentName: req.user.user_metadata?.full_name || 'Student',
      subject: activeSubject
    });

    const memoryContext = memories.length > 0
      ? `STUDENT KNOWLEDGE BASE & PAST WEAKNESSES:\n${memories.map(m => `- [${m.type.toUpperCase()}] ${m.text}`).join('\n')}\n\n`
      : '';

    const ragContext = retrievedChunks.length > 0
      ? `OFFICIAL TEXTBOOK EXCERPTS (Use these to ground explanations and citations):\n${retrievedChunks.map((c, i) => `[Source ${i + 1}] (${c.chapter}):\n${c.content}`).join('\n\n')}\n\n`
      : '';

    const fullPrompt = `${systemPrompt}

${memoryContext}${ragContext}CONVERSATION HISTORY:
${reversedHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

ASSISTANT RESPONSE:`;

    // 7. Generate Response (Gemini 1.5 Flash with fallback)
    let replyText = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        replyText = response.text().trim();
      } catch (geminiErr) {
        console.warn('Gemini generateContent error in Saarthi mentor:', geminiErr.message);
      }
    }

    if (!replyText) {
      replyText = buildFallbackResponse(content, retrievedChunks, activeMode, activeSubject, Number(classLevel), language);
    }

    // 8. Citations metadata
    const sources = retrievedChunks.map(c => ({
      id: c.id,
      chapter: c.chapter,
      source: c.source,
      page: c.page || 1,
      similarity: c.similarity
    }));

    // 9. Save Assistant message to database
    const { data: assistantMsg, error: aErr } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: replyText,
        sources
      })
      .select()
      .single();

    if (aErr) throw aErr;

    // 10. Update session timestamp
    await supabaseAdmin
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    // 11. Asynchronously extract memory facts
    extractAndStoreFacts(userId, content, activeSubject).catch(err => console.warn('Fact extraction error:', err));

    return res.json({
      success: true,
      message: assistantMsg,
      reply: assistantMsg.content,
      sources
    });

  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process message', error: err.message });
  }
};

/**
 * Direct chat endpoint for single-turn or auto-session UI
 * POST /api/mentor/chat
 */
exports.directChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, query, mode = 'doubt', subject = 'physics', classLevel = 10, language = 'en' } = req.body;
    const content = message || query;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Find active session or create one
    let { data: session } = await supabaseAdmin
      .from('chat_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('mode', mode)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!session) {
      const { data: newSess, error: createErr } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: content.slice(0, 35) + (content.length > 35 ? '...' : ''),
          mode,
          subject
        })
        .select('id')
        .single();
      if (createErr) throw createErr;
      session = newSess;
    }

    req.params = { id: session.id };
    req.body = { content, mode, subject, classLevel, language };
    
    return exports.sendMessage(req, res);
  } catch (err) {
    console.error('Direct chat error:', err);
    return res.status(500).json({ success: false, message: 'Direct chat failed', error: err.message });
  }
};

/**
 * Get student's persistent memories
 * GET /api/mentor/memories
 */
exports.getMemories = async (req, res) => {
  try {
    const userId = req.user.id;
    const memories = await getStudentMemories(userId);
    return res.json({
      success: true,
      data: memories
    });
  } catch (err) {
    console.error('Get memories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch memories', error: err.message });
  }
};

/**
 * Delete a memory fact
 * DELETE /api/mentor/memories/:id
 */
exports.deleteMemory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('memory_facts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Memory deleted'
    });
  } catch (err) {
    console.error('Delete memory error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete memory', error: err.message });
  }
};

/**
 * Fallback synthesizer for Saarthi when offline or quota is exceeded
 */
function buildFallbackResponse(query, chunks, mode, subject, classLevel, lang) {
  const topChunk = chunks && chunks.length > 0 ? chunks[0] : null;

  if (lang === 'hi') {
    if (mode === 'mentor') {
      return `### सारथी मेंटर मार्गदर्शन (CBSE कक्षा ${classLevel} - ${subject.toUpperCase()})

नमस्ते! आपके अध्ययन लक्ष्य और संदेह के लिए मैं यहाँ हूँ।

1. **संकल्पना समीक्षा:** सबसे पहले अध्याय के मुख्य सिद्धांतों को समझें। ${topChunk ? `अध्याय: **${topChunk.chapter}** में मुख्य अवधारणाओं का पुनरावलोकन करें।` : ''}
2. **अभ्यास रणनीति:** प्रतिदिन 3-4 संख्यात्मक या वैचारिक प्रश्नों का अभ्यास करें।
3. **अगला कदम:** क्या आप इस विषय पर 5 प्रश्नों की त्वरित अभ्यास क्विज़ हल करना चाहेंगे?`;
    }

    return `### सारथी समाधान (CBSE कक्षा ${classLevel})

${topChunk ? `**अध्याय संदर्भ: ${topChunk.chapter}**\n\n${topChunk.content}\n\n---\n` : ''}
**चरण-दर-चरण व्याख्या:**
1. सबसे पहले दी गई राशियों (Given quantities) को लिखें और उनके SI मात्रक जाँचें।
2. मानक CBSE सूत्र लागू करें।
3. अंतिम उत्तर में मात्रक (Units) लिखना न भूलें।

💡 **CBSE टिप:** परीक्षा में सूत्र लिखने का 1 अंक निर्धारित होता है!`;
  }

  if (mode === 'mentor') {
    return `### Saarthi Mentor Guidance (CBSE Class ${classLevel} • ${subject.toUpperCase()})

Hello! I have reviewed your learning focus. Here is a targeted study path:

1. **Concept Reinforcement:** ${topChunk ? `Focus on **${topChunk.chapter}**. Review the core definitions and standard derivations.` : 'Build clarity on foundational definitions first.'}
2. **Targeted Practice:** Solve 3 numerical problems or short-answer questions daily using active recall.
3. **Next Step:** Would you like me to walk you through a practice problem or generate a quick diagnostic quiz?`;
  }

  return `### Saarthi Guided Doubt Solver (CBSE Class ${classLevel})

${topChunk ? `**Curriculum Reference: ${topChunk.chapter}**\n\n${topChunk.content}\n\n---\n` : ''}
**Step-by-step Framework:**
1. **Identify the Given Data:** Note all variables and convert them into standard SI units.
2. **Formula Selection:** State the governing formula clearly before plugging in numbers.
3. **Calculation & Units:** Compute systematically and box your final answer with its correct unit.

💡 **CBSE Board Exam Tip:** Always state the definition or law before writing the formula to earn complete marks in section B and C questions!`;
}
