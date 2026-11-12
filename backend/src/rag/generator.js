const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';

/**
 * Build grounded system prompt for CBSE RAG answer generation
 */
function buildPrompt(query, retrievedChunks = [], options = {}) {
  const language = options.language || 'en';
  const classLevel = options.classLevel || 10;
  const board = options.board || 'CBSE';

  const contextText = (retrievedChunks || [])
    .map((chunk, idx) => `[Source ${idx + 1}] (Chapter: ${chunk.chapter || 'Curriculum'}, Source: ${chunk.source || 'NCERT'})\n${chunk.content}`)
    .join('\n\n---\n\n');

  const langInstruction = language === 'hi'
    ? 'उत्तर शुद्ध और सरल हिंदी (Devanagari script) में दीजिए।'
    : language === 'mr'
    ? 'उत्तर सोप्या आणि अचूक मराठीत (Devanagari script) द्या.'
    : 'Provide the response in clear, encouraging English.';

  return `You are Saarthi, an expert AI tutor specializing in the ${board} curriculum for Class ${classLevel}.
Your objective is to help students learn with clarity, scientific precision, and step-by-step pedagogy.

LANGUAGE REQUIREMENT:
${langInstruction}

CONTEXT FROM CURRICULUM TEXTBOOK:
${contextText ? contextText : 'No direct context matches found in textbook database.'}

RULES:
1. Ground your answer primarily in the provided textbook context whenever available.
2. If the context contains the answer, explain it clearly at the Class ${classLevel} level. Format mathematical formulas and chemical equations clearly.
3. If the context does NOT contain the exact answer:
   - State clearly: "This topic is outside the direct textbook excerpts provided, but here is the standard CBSE explanation:"
   - Then provide a scientifically accurate, grade-appropriate CBSE explanation.
4. Keep the tone patient, encouraging, and educational. Use bullet points or numbered steps for explanations.
5. Highlight key CBSE board exam keywords and formulas where relevant.
6. Provide citations to the relevant chapter at the end of the answer if context was used.

STUDENT'S QUESTION:
"${query}"
`;
}

/**
 * Generate answer using Gemini 1.5 Flash or intelligent fallback
 * @param {string} query
 * @param {Array<object>} retrievedChunks
 * @param {object} options
 * @returns {Promise<{ answer: string, sources: Array<object>, model: string }>}
 */
async function generateAnswer(query, retrievedChunks = [], options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = buildPrompt(query, retrievedChunks, options);

  const sources = (retrievedChunks || []).map(c => ({
    id: c.id,
    chapter: c.chapter || 'NCERT Curriculum',
    source: c.source || 'CBSE Standard Material',
    page: c.page || 1,
    similarity: c.similarity
  }));

  if (apiKey && apiKey.trim()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        return {
          answer: text.trim(),
          sources,
          model: GEMINI_MODEL
        };
      }
    } catch (err) {
      console.warn('Gemini generation API error, falling back to local synthesizer:', err.message);
    }
  }

  // High quality local fallback synthesizer when Gemini API key is absent or offline
  const fallbackAnswer = synthesizeLocalAnswer(query, retrievedChunks, options);
  return {
    answer: fallbackAnswer,
    sources,
    model: 'local-synthesizer'
  };
}

/**
 * Pedagogical synthesizer using retrieved chunk content
 */
function synthesizeLocalAnswer(query, chunks = [], options = {}) {
  const lang = options.language || 'en';
  const classLevel = options.classLevel || 10;

  if (!chunks || chunks.length === 0) {
    if (lang === 'hi') {
      return `नमस्ते! आपके प्रश्न "${query}" के लिए संदर्भ पाठ्यपुस्तक में सीधा अंश नहीं मिला, परंतु CBSE कक्षा ${classLevel} के पाठ्यक्रम अनुसार कृपया संबंधित अध्याय का अध्ययन करें अथवा विशिष्ट वैज्ञानिक शब्दावली के साथ पुनः पूछें।`;
    }
    return `Hello! For your query "${query}", no direct matching excerpt was retrieved in the curriculum store for Class ${classLevel}. Please verify the chapter or ask with specific STEM terms.`;
  }

  const primaryChunk = chunks[0];
  const relatedExcerpts = chunks.map(c => c.content).join('\n\n');

  if (lang === 'hi') {
    return `### सारथी समाधान (CBSE कक्षा ${classLevel})

**अध्याय:** ${primaryChunk.chapter || 'NCERT विज्ञान'}

${primaryChunk.content}

---
💡 **CBSE परीक्षा टिप:** मुख्य परिभाषाओं और सूत्रों को हमेशा स्पष्ट रूप से रेखांकित करें।`;
  }

  return `### Saarthi Guided Explanation (CBSE Class ${classLevel})

**Source Chapter:** ${primaryChunk.chapter || 'NCERT Curriculum'}

${primaryChunk.content}

---
💡 **CBSE Exam Tip:** Always write the standard definition first, state the SI units, and write formulas clearly step-by-step for full marks.`;
}

module.exports = {
  buildPrompt,
  generateAnswer
};

