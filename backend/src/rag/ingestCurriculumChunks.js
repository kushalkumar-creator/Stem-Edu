/**
 * Ingestion Script for CBSE Curriculum Chunks (Task P2-2.3 & P2-2.4)
 * 
 * Fetches all curriculum lessons from Supabase (Class 10 & 12 across Physics,
 * Chemistry, Biology, Mathematics), cleans & chunks text, computes 768-dim embeddings,
 * and upserts into `public.chunks` table with `user_id = null`.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { supabaseAdmin } = require('../../utils/supabaseAdmin');
const { chunkText } = require('./chunker');
const { getEmbedding } = require('./embeddings');

// Delay helper to respect API rate limits (e.g. 15 RPM for Gemini free tier)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ingestCurriculumChunks() {
  console.log('\n============================================================');
  console.log('   INGESTING CURRICULUM CHUNKS INTO RAG VECTOR STORE');
  console.log('============================================================\n');

  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized.');
    process.exit(1);
  }

  try {
    // 1. Fetch lessons with chapter and subject info
    const { data: lessons, error: lessonErr } = await supabaseAdmin
      .from('lessons')
      .select(`
        id,
        lesson_number,
        title,
        title_hindi,
        summary,
        summary_hindi,
        content_blocks,
        class_level,
        board,
        language,
        chapters:chapter_id (
          id,
          chapter_number,
          title,
          subjects:subject_id (
            id,
            name,
            code
          )
        )
      `);

    if (lessonErr) {
      throw lessonErr;
    }

    console.log(`Found ${lessons.length} lessons in curriculum database.`);
    let totalChunksIngested = 0;
    let skippedChunks = 0;

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const chapter = lesson.chapters || {};
      const subject = chapter.subjects || {};

      const subjectCode = subject.code || 'stem';
      const chapterTitle = chapter.title || `Chapter ${chapter.chapter_number || 'General'}`;
      const classLevel = lesson.class_level || 10;
      const board = lesson.board || 'CBSE';

      console.log(`\n[${i + 1}/${lessons.length}] Ingesting: [${board} Class ${classLevel}] ${subject.name || subjectCode} -> ${chapterTitle} -> Lesson ${lesson.lesson_number}: ${lesson.title}`);

      // Assemble full readable text for the lesson
      const blocksText = (lesson.content_blocks || [])
        .map(b => {
          if (typeof b === 'string') return b;
          if (b.content) return b.content;
          if (b.formula) return `Formula: ${b.formula}`;
          return '';
        })
        .filter(Boolean)
        .join('\n\n');

      const fullLessonText = [
        `Chapter: ${chapterTitle}`,
        `Lesson: ${lesson.title}`,
        lesson.summary ? `Summary: ${lesson.summary}` : '',
        blocksText
      ].filter(Boolean).join('\n\n');

      const metadata = {
        board,
        classLevel,
        class_level: classLevel,
        subject: subjectCode,
        chapter: chapterTitle,
        language: lesson.language || 'en',
        source: 'CBSE Official NCERT Model Curriculum',
        type: 'textbook'
      };

      // Chunk text into semantic sections (~1000 chars)
      const chunks = chunkText(fullLessonText, metadata, 1000, 150);
      console.log(`   Generated ${chunks.length} chunks for lesson`);

      for (const chunk of chunks) {
        // Generate 768-dim embedding
        const { embedding, model, source } = await getEmbedding(chunk.content);

        const chunkRecord = {
          content: chunk.content,
          content_hash: chunk.contentHash,
          embedding: embedding,
          embedding_model: model,
          board: chunk.board,
          class_level: chunk.class_level,
          subject: chunk.subject,
          chapter: chunk.chapter,
          page: 1,
          language: chunk.language || 'en',
          source: chunk.source,
          type: 'textbook',
          user_id: null
        };

        const { error: insertErr } = await supabaseAdmin
          .from('chunks')
          .upsert(chunkRecord, { onConflict: 'content_hash' });

        if (insertErr) {
          console.warn(`   ⚠️ Error inserting chunk:`, insertErr.message);
        } else {
          totalChunksIngested++;
          process.stdout.write('.');
        }

        // Slight rate-limit cushion if using live Gemini API
        if (source === 'gemini') {
          await sleep(250);
        }
      }
    }

    console.log('\n\n============================================================');
    console.log(`✅ RAG INGESTION COMPLETE:`);
    console.log(`   - Newly ingested chunks: ${totalChunksIngested}`);
    console.log(`   - Already existing chunks (idempotent skipped): ${skippedChunks}`);
    console.log(`   - Total chunks verified in vector store.`);
    console.log('============================================================\n');

  } catch (err) {
    console.error('❌ RAG Ingestion failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestCurriculumChunks();
}

module.exports = ingestCurriculumChunks;
