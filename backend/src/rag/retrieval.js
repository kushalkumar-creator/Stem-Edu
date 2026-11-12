const { supabaseAdmin } = require('../../utils/supabaseAdmin');
const { getEmbedding } = require('./embeddings');

/**
 * Retrieve relevant chunks using vector similarity and SQL function match_chunks
 * @param {string} query - Student query / doubt
 * @param {object} filters - Filtering criteria
 * @param {number} k - Maximum number of chunks to return (default: 5)
 * @returns {Promise<Array<object>>} Matching chunks with similarity scores
 */
async function retrieve(query, filters = {}, k = 5) {
  if (!query || !query.trim()) return [];

  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // 1. Generate query embedding vector
  const { embedding } = await getEmbedding(query);

  const board = filters.board || 'CBSE';
  const classLevel = Number(filters.classLevel || filters.class_level || 10);
  const subject = filters.subject || null;
  const language = filters.language || 'en';
  const userId = filters.userId || filters.user_id || null;
  const minSimilarity = typeof filters.minSimilarity === 'number' ? filters.minSimilarity : 0.15;

  // 2. Call Supabase RPC function match_chunks
  const { data, error } = await supabaseAdmin.rpc('match_chunks', {
    query_embedding: embedding,
    match_count: k,
    min_similarity: minSimilarity,
    p_board: board,
    p_class: classLevel,
    p_subject: subject,
    p_language: language,
    p_user_id: userId
  });

  if (error) {
    console.error('Vector retrieval RPC error:', error);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    content: row.content,
    chapter: row.chapter,
    page: row.page,
    source: row.source,
    type: row.type,
    similarity: Math.round(row.similarity * 1000) / 1000
  }));
}

module.exports = {
  retrieve
};
