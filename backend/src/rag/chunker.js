const crypto = require('crypto');

/**
 * Clean raw text by normalizing whitespace, line breaks, and hyphenated line-wraps
 */
function cleanText(rawText) {
  if (!rawText) return '';
  return rawText
    // Remove hyphenated linebreaks (e.g., "elec-\ntricity" -> "electricity")
    .replace(/(\w+)-\n(\w+)/g, '$1$2')
    // Normalize unicode whitespace
    .replace(/[\r\t]+/g, ' ')
    // Remove repetitive page footer/header patterns
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '')
    // Replace 3+ consecutive newlines with 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Compute SHA-256 content hash for idempotent upserts
 */
function computeContentHash(content, metadata = {}) {
  const payload = `${content.trim()}|${metadata.board || 'CBSE'}|${metadata.classLevel || 10}|${metadata.subject || ''}|${metadata.chapter || ''}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Chunk document text using semantic paragraphs and sliding token windows
 * @param {string} text - Cleaned textbook or note text
 * @param {object} metadata - Metadata to attach to each chunk
 * @param {number} targetChunkSize - Target characters per chunk (~1500 chars ≈ 350-450 tokens)
 * @param {number} overlapSize - Overlap characters (~200 chars ≈ 50 tokens)
 * @returns {Array<object>} Chunks with content, contentHash, and metadata
 */
function chunkText(text, metadata = {}, targetChunkSize = 1200, overlapSize = 150) {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  // Split by double newline (paragraphs/headings) first
  const paragraphs = cleaned.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let currentBuffer = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];

    if ((currentBuffer.length + p.length) < targetChunkSize) {
      currentBuffer = currentBuffer ? `${currentBuffer}\n\n${p}` : p;
    } else {
      if (currentBuffer) {
        chunks.push({
          content: currentBuffer,
          contentHash: computeContentHash(currentBuffer, metadata),
          ...metadata
        });

        // Retain overlap tail from the previous buffer
        const overlap = currentBuffer.slice(-overlapSize);
        currentBuffer = `${overlap}\n\n${p}`.trim();
      } else {
        // If a single paragraph is larger than targetChunkSize, slice it
        let start = 0;
        while (start < p.length) {
          const slice = p.slice(start, start + targetChunkSize);
          chunks.push({
            content: slice,
            contentHash: computeContentHash(slice, metadata),
            ...metadata
          });
          start += (targetChunkSize - overlapSize);
        }
        currentBuffer = '';
      }
    }
  }

  if (currentBuffer.trim()) {
    chunks.push({
      content: currentBuffer.trim(),
      contentHash: computeContentHash(currentBuffer, metadata),
      ...metadata
    });
  }

  return chunks;
}

module.exports = {
  cleanText,
  computeContentHash,
  chunkText
};

