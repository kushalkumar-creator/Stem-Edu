/**
 * Supabase Data Migration & Seed Script (SUPABASE_SETUP.md Section 9)
 * Populates Supabase Postgres tables with:
 *   - 3 Interactive SVG Diagrams (public.diagrams)
 *   - 4 STEM Subjects (public.subjects)
 *   - 4 Chapters (public.chapters)
 *   - 16 Lessons (public.lessons)
 *   - 41+ MCQs (public.questions)
 *   - 1 Three.js 3D Virtual Lab (public.labs)
 *   - 2 Demo Users in Supabase Auth (student@stem.edu & admin@stem.edu)
 * 
 * Safe to run multiple times (idempotent upserts).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { curriculumData, diagramsData, labData } = require('../data/seedCurriculum');

async function migrate() {
  if (!supabaseAdmin) {
    console.error('❌ Supabase client could not be initialized.');
    console.error('Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
  }

  console.log('\n============================================================');
  console.log('   MIGRATING STEM CURRICULUM TO SUPABASE POSTGRESQL');
  console.log('============================================================\n');

  try {
    // -------------------------------------------------------------
    // 1. Seed Interactive Diagrams
    // -------------------------------------------------------------
    console.log('📊 1. Seeding Diagrams (public.diagrams)...');
    const diagramMap = new Map();

    for (const d of diagramsData) {
      const payload = {
        title: d.title,
        title_hindi: d.titleHindi,
        subject_code: d.subjectCode,
        svg_viewbox: d.svgViewBox || '0 0 600 400',
        elements: d.elements || []
      };

      // Check if exists
      const { data: existing } = await supabaseAdmin
        .from('diagrams')
        .select('id')
        .eq('title', d.title)
        .maybeSingle();

      let diagramId;
      if (existing) {
        diagramId = existing.id;
        await supabaseAdmin.from('diagrams').update(payload).eq('id', diagramId);
      } else {
        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('diagrams')
          .insert(payload)
          .select('id')
          .single();
        if (insertErr) throw insertErr;
        diagramId = inserted.id;
      }

      diagramMap.set(d.title, diagramId);
      console.log(`   ✔ Diagram: ${d.title} (ID: ${diagramId})`);
    }

    // -------------------------------------------------------------
    // 2. Seed Subjects, Chapters, Lessons & Questions
    // -------------------------------------------------------------
    console.log('\n📚 2. Seeding Curriculum (Subjects, Chapters, Lessons, MCQs)...');
    let totalLessonsCount = 0;
    let totalQuestionsCount = 0;
    let physicsSubjectId = null;

    for (const item of curriculumData) {
      // 2a. Subject
      const subjPayload = {
        name: item.subject.name,
        name_hindi: item.subject.nameHindi,
        code: item.subject.code,
        description: item.subject.description,
        description_hindi: item.subject.descriptionHindi,
        icon: item.subject.icon,
        color: item.subject.color,
        class_level: item.subject.classLevel || 10,
        board: item.subject.board || 'CBSE',
        order_num: item.subject.order || 0
      };

      const { data: existingSubj } = await supabaseAdmin
        .from('subjects')
        .select('id')
        .eq('code', item.subject.code)
        .maybeSingle();

      let subjectId;
      if (existingSubj) {
        subjectId = existingSubj.id;
        await supabaseAdmin.from('subjects').update(subjPayload).eq('id', subjectId);
      } else {
        const { data: insertedSubj, error: subjErr } = await supabaseAdmin
          .from('subjects')
          .insert(subjPayload)
          .select('id')
          .single();
        if (subjErr) throw subjErr;
        subjectId = insertedSubj.id;
      }

      if (item.subject.code === 'physics') {
        physicsSubjectId = subjectId;
      }
      console.log(`\n   📖 Subject: ${item.subject.name} [${item.subject.code}]`);

      // 2b. Chapter
      const chapPayload = {
        subject_id: subjectId,
        chapter_number: item.chapter.chapterNumber,
        title: item.chapter.title,
        title_hindi: item.chapter.titleHindi,
        description: item.chapter.description,
        description_hindi: item.chapter.descriptionHindi,
        class_level: item.chapter.classLevel || 10,
        board: item.chapter.board || 'CBSE',
        order_num: item.chapter.order || 0
      };

      const { data: existingChap } = await supabaseAdmin
        .from('chapters')
        .select('id')
        .eq('subject_id', subjectId)
        .eq('chapter_number', item.chapter.chapterNumber)
        .maybeSingle();

      let chapterId;
      if (existingChap) {
        chapterId = existingChap.id;
        await supabaseAdmin.from('chapters').update(chapPayload).eq('id', chapterId);
      } else {
        const { data: insertedChap, error: chapErr } = await supabaseAdmin
          .from('chapters')
          .insert(chapPayload)
          .select('id')
          .single();
        if (chapErr) throw chapErr;
        chapterId = insertedChap.id;
      }
      console.log(`      📁 Chapter ${item.chapter.chapterNumber}: ${item.chapter.title}`);

      // 2c. Lessons
      for (const lesson of item.lessons) {
        let diagramId = null;
        if (item.subject.code === 'physics' && lesson.lessonNumber === 1) {
          diagramId = diagramMap.get('Electric Circuit Diagram') || null;
        } else if (item.subject.code === 'biology' && lesson.lessonNumber === 1) {
          diagramId = diagramMap.get('Plant Cell Anatomy') || null;
        } else if (item.subject.code === 'chemistry' && lesson.lessonNumber === 1) {
          diagramId = diagramMap.get('Interactive Periodic Elements') || null;
        }

        const lessonPayload = {
          chapter_id: chapterId,
          lesson_number: lesson.lessonNumber,
          title: lesson.title,
          title_hindi: lesson.titleHindi,
          summary: lesson.summary,
          summary_hindi: lesson.summaryHindi,
          content_blocks: lesson.contentBlocks || [],
          diagram_id: diagramId,
          order_num: lesson.lessonNumber
        };

        const { data: existingLesson } = await supabaseAdmin
          .from('lessons')
          .select('id')
          .eq('chapter_id', chapterId)
          .eq('lesson_number', lesson.lessonNumber)
          .maybeSingle();

        if (existingLesson) {
          await supabaseAdmin.from('lessons').update(lessonPayload).eq('id', existingLesson.id);
        } else {
          const { error: lessonErr } = await supabaseAdmin.from('lessons').insert(lessonPayload);
          if (lessonErr) throw lessonErr;
        }
        totalLessonsCount++;
      }

      // 2d. Questions (MCQs)
      for (const q of item.questions) {
        const questionPayload = {
          chapter_id: chapterId,
          question_text: q.questionText,
          question_text_hindi: q.questionTextHindi || '',
          options: q.options || [],
          options_hindi: q.optionsHindi || [],
          correct_option_index: q.correctIndex !== undefined ? q.correctIndex : (q.correctOptionIndex || 0),
          explanation: q.explanation,
          explanation_hindi: q.explanationHindi || '',
          difficulty: q.difficulty || 'medium',
          marks: 1
        };

        const { data: existingQ } = await supabaseAdmin
          .from('questions')
          .select('id')
          .eq('chapter_id', chapterId)
          .eq('question_text', q.questionText)
          .maybeSingle();

        if (existingQ) {
          await supabaseAdmin.from('questions').update(questionPayload).eq('id', existingQ.id);
        } else {
          const { error: qErr } = await supabaseAdmin.from('questions').insert(questionPayload);
          if (qErr) throw qErr;
        }
        totalQuestionsCount++;
      }
    }

    // -------------------------------------------------------------
    // 3. Seed Virtual Lab (public.labs)
    // -------------------------------------------------------------
    console.log('\n🔬 3. Seeding Virtual Labs (public.labs)...');
    const labPayload = {
      title: labData.title,
      title_hindi: labData.titleHindi,
      experiment_type: labData.experimentType,
      description: labData.description,
      description_hindi: labData.descriptionHindi,
      instructions: labData.instructions || [],
      instructions_hindi: labData.instructionsHindi || [],
      variables: labData.variables || [],
      quiz: labData.quiz || [],
      subject_id: physicsSubjectId
    };

    const { data: existingLab } = await supabaseAdmin
      .from('labs')
      .select('id')
      .eq('experiment_type', labData.experimentType)
      .maybeSingle();

    if (existingLab) {
      await supabaseAdmin.from('labs').update(labPayload).eq('id', existingLab.id);
      console.log(`   ✔ Updated Virtual Lab: ${labData.title}`);
    } else {
      const { error: labErr } = await supabaseAdmin.from('labs').insert(labPayload);
      if (labErr) throw labErr;
      console.log(`   ✔ Inserted Virtual Lab: ${labData.title}`);
    }

    // -------------------------------------------------------------
    // 4. Seed Demo Users in Supabase Auth
    // -------------------------------------------------------------
    console.log('\n👥 4. Seeding Demo Users (Supabase Auth & public.profiles)...');
    const demoUsers = [
      {
        email: 'student@stem.edu',
        password: 'Password123!',
        fullName: 'Arjun Sharma',
        role: 'student',
        classLevel: 10,
        board: 'CBSE'
      },
      {
        email: 'admin@stem.edu',
        password: 'Password123!',
        fullName: 'Dr. Vikram Sarabhai',
        role: 'admin',
        classLevel: 10,
        board: 'CBSE'
      }
    ];

    for (const u of demoUsers) {
      // List users to check if already exists
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = userList?.users?.find(usr => usr.email === u.email);

      let userId;
      if (existingUser) {
        userId = existingUser.id;
        console.log(`   ✔ User already exists: ${u.email} (${userId})`);
      } else {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            full_name: u.fullName,
            role: u.role
          }
        });
        if (createErr) {
          console.warn(`   ⚠️ Could not create auth user ${u.email}:`, createErr.message);
        } else {
          userId = newUser.user.id;
          console.log(`   ✔ Created Auth User: ${u.email} (${userId})`);
        }
      }

      if (userId) {
        // Upsert profile
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          full_name: u.fullName,
          role: u.role,
          board: u.board,
          class_level: u.classLevel,
          preferred_language: 'en'
        });
        console.log(`   ✔ Profile updated for: ${u.fullName} [Role: ${u.role}]`);
      }
    }

    console.log('\n============================================================');
    console.log('✅ SUPABASE MIGRATION COMPLETED SUCCESSFULLY!');
    console.log(`   - 4 Subjects seeded`);
    console.log(`   - 4 Chapters seeded`);
    console.log(`   - ${totalLessonsCount} Lessons seeded`);
    console.log(`   - ${totalQuestionsCount} MCQs seeded`);
    console.log(`   - 3 Interactive SVG Diagrams seeded`);
    console.log(`   - 1 Virtual Physics Lab seeded`);
    console.log('============================================================\n');
  } catch (err) {
    console.error('❌ Migration failed with error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;

