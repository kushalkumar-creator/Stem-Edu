const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const EMBEDDING_MODEL_NAME = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
const EMBEDDING_DIMENSION = 768;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with', 'what', 'how', 'why', 'does',
  'occur', 'between', 'into', 'under', 'through', 'where'
]);

/**
 * Standard light STEM term stemmer
 */
function stemWord(w) {
  if (!w || w.length <= 3) return w;
  if (w === 'matrices' || w === 'matrix') return 'matrix';
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('ses') || w.endsWith('xes') || w.endsWith('zes') || w.endsWith('ches') || w.endsWith('shes')) return w.slice(0, -2);
  if (w.endsWith('tions') || w.endsWith('tion')) return w.slice(0, w.endsWith('tions') ? -5 : -4);
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

/**
 * 32-bit Murmur-like hash helper
 */
function hashWord(str, seed = 0) {
  let h = seed ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0);
}

/**
 * Generate a deterministic normalized 768-float unit vector using
 * Feature Hashing (Hashing Vectorizer with sublinear term-frequency weights)
 * Preserves semantic keyword similarity in 768-dim vector space when offline
 */
function generateDeterministicEmbedding(text) {
  const vector = new Array(EMBEDDING_DIMENSION).fill(0);
  if (!text) return vector;

  // 1. Tokenize into clean stemmed lowercase words
  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
    .map(stemWord);

  if (rawWords.length === 0) {
    const hash = crypto.createHash('sha256').update(text).digest();
    let norm = 0;
    for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
      const val = (hash[i % hash.length] / 255.0) * 2.0 - 1.0;
      vector[i] = val;
      norm += val * val;
    }
    norm = Math.sqrt(norm) || 1.0;
    return vector.map(v => v / norm);
  }

  // 2. Count term frequencies for unigrams and bigrams
  const termCounts = new Map();
  for (let i = 0; i < rawWords.length; i++) {
    const unigram = rawWords[i];
    termCounts.set(unigram, (termCounts.get(unigram) || 0) + 1);

    if (i < rawWords.length - 1) {
      const bigram = `${unigram}_${rawWords[i + 1]}`;
      termCounts.set(bigram, (termCounts.get(bigram) || 0) + 1);
    }
  }

  // 3. Project tokens into 768 dimensions using signed feature hashing
  for (const [term, count] of termCounts.entries()) {
    const weight = 1.0 + Math.log(count);
    const h1 = hashWord(term, 0x12345678);
    const h2 = hashWord(term, 0x87654321);

    const bucket = h1 % EMBEDDING_DIMENSION;
    const sign = (h2 & 1) === 0 ? 1.0 : -1.0;

    vector[bucket] += sign * weight;
  }

  // 4. L2-normalize to unit vector for cosine distance calculations
  let norm = 0;
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}

/**
 * Generate 768-dimensional vector embedding for input text
 * @param {string} text - Content to embed
 * @returns {Promise<{ embedding: number[], model: string, source: string }>}
 */
async function getEmbedding(text) {
  if (!text || !text.trim()) {
    return {
      embedding: new Array(EMBEDDING_DIMENSION).fill(0),
      model: EMBEDDING_MODEL_NAME,
      source: 'zero'
    };
  }

  const cleanText = text.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
      const result = await model.embedContent(cleanText);
      const values = result.embedding?.values;

      if (values && values.length === EMBEDDING_DIMENSION) {
        return {
          embedding: values,
          model: EMBEDDING_MODEL_NAME,
          source: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini embedding API fallback:', err.message);
    }
  }

  // High quality deterministic feature hashing vector
  return {
    embedding: generateDeterministicEmbedding(cleanText),
    model: `${EMBEDDING_MODEL_NAME}-hash`,
    source: 'deterministic'
  };
}

module.exports = {
  getEmbedding,
  generateDeterministicEmbedding,
  EMBEDDING_DIMENSION,
  EMBEDDING_MODEL_NAME
};
