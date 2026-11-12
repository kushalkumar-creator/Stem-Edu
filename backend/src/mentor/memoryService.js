const { supabaseAdmin } = require('../../utils/supabaseAdmin');
const { getEmbedding } = require('../rag/embeddings');

/**
 * Fetch persistent student memory facts
 */
async function getStudentMemories(userId, subject = null) {
  if (!userId || !supabaseAdmin) return [];

  let query = supabaseAdmin
    .from('memory_facts')
    .select('id, type, text, subject, importance, last_used_at')
    .eq('user_id', userId)
    .order('importance', { ascending: false })
    .limit(8);

  if (subject) {
    query = query.or(`subject.eq.${subject},subject.is.null`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('Error fetching student memories:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Save an extracted memory fact for student
 */
async function saveMemoryFact(userId, { type = 'weakness', text, subject = null, importance = 1 }) {
  if (!userId || !text || !text.trim() || !supabaseAdmin) return null;

  const cleanText = text.trim();
  const { embedding } = await getEmbedding(cleanText);

  // Check if identical memory already exists
  const { data: existing } = await supabaseAdmin
    .from('memory_facts')
    .select('id, importance')
    .eq('user_id', userId)
    .eq('text', cleanText)
    .maybeSingle();

  if (existing) {
    // Increment importance and touch last_used_at
    await supabaseAdmin
      .from('memory_facts')
      .update({
        importance: Math.min((existing.importance || 1) + 1, 5),
        last_used_at: new Date().toISOString()
      })
      .eq('id', existing.id);
    return existing;
  }

  const { data, error } = await supabaseAdmin
    .from('memory_facts')
    .insert({
      user_id: userId,
      type,
      text: cleanText,
      subject,
      importance,
      embedding,
      created_at: new Date().toISOString(),
      last_used_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.warn('Error saving memory fact:', error.message);
    return null;
  }
  return data;
}

/**
 * Heuristic and pattern-based fact extractor for student messages
 */
async function extractAndStoreFacts(userId, userMessage, subject = null) {
  if (!userId || !userMessage) return;

  const msg = userMessage.toLowerCase();

  // Weakness patterns
  const weakPatterns = [
    /struggling with ([a-zA-Z\s]{3,30})/i,
    /difficult(?:y)? in ([a-zA-Z\s]{3,30})/i,
    /confused about ([a-zA-Z\s]{3,30})/i,
    /can(?:not|'t) understand ([a-zA-Z\s]{3,30})/i,
    /don't understand ([a-zA-Z\s]{3,30})/i,
    /weak in ([a-zA-Z\s]{3,30})/i
  ];

  for (const pat of weakPatterns) {
    const match = msg.match(pat);
    if (match && match[1]) {
      const topic = match[1].trim();
      await saveMemoryFact(userId, {
        type: 'weakness',
        text: `Needs reinforcement in: ${topic}`,
        subject,
        importance: 2
      });
      return;
    }
  }

  // Goal patterns
  const goalPatterns = [
    /want to score (\d{2,3}%?)/i,
    /aiming for (\d{2,3}%?)/i,
    /target is ([a-zA-Z0-9\s]{3,30})/i,
    /exam is in ([a-zA-Z0-9\s]{3,20})/i
  ];

  for (const pat of goalPatterns) {
    const match = msg.match(pat);
    if (match && match[1]) {
      await saveMemoryFact(userId, {
        type: 'goal',
        text: `Target goal: ${match[1].trim()}`,
        subject,
        importance: 3
      });
      return;
    }
  }
}

module.exports = {
  getStudentMemories,
  saveMemoryFact,
  extractAndStoreFacts
};
