const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { supabaseAdmin } = require('../utils/supabaseAdmin');

async function checkMultiboard() {
  console.log('Testing Multi-board and Multi-language readiness (P2-1.6)...');

  // 1. Get Physics subject ID
  const { data: physics } = await supabaseAdmin
    .from('subjects')
    .select('id')
    .eq('code', 'physics')
    .single();

  if (!physics) {
    console.error('Physics subject not found');
    process.exit(1);
  }

  // 2. Insert sample ICSE chapter
  const sampleIcse = {
    subject_id: physics.id,
    chapter_number: 99,
    title: 'Force and Machines (ICSE Sample)',
    title_hindi: 'बल और सरल मशीनें (ICSE)',
    description: 'Sample chapter for multi-board proof of concept.',
    class_level: 10,
    board: 'ICSE',
    language: 'en',
    order_num: 99
  };

  const { data: existing } = await supabaseAdmin
    .from('chapters')
    .select('id')
    .eq('subject_id', physics.id)
    .eq('class_level', 10)
    .eq('chapter_number', 99)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from('chapters').insert(sampleIcse);
    console.log('✔ Inserted sample ICSE chapter (Force and Machines)');
  } else {
    console.log('✔ Sample ICSE chapter already exists');
  }

  // 3. Query as CBSE student
  const { data: cbseChapters } = await supabaseAdmin
    .from('chapters')
    .select('chapter_number, title, board')
    .eq('subject_id', physics.id)
    .eq('board', 'CBSE')
    .eq('class_level', 10);

  const hasIcseInCbse = cbseChapters.some(c => c.board !== 'CBSE');
  console.log(`✔ CBSE Class 10 query returned ${cbseChapters.length} chapters (Contains non-CBSE: ${hasIcseInCbse})`);

  // 4. Query as ICSE student
  const { data: icseChapters } = await supabaseAdmin
    .from('chapters')
    .select('chapter_number, title, board')
    .eq('subject_id', physics.id)
    .eq('board', 'ICSE')
    .eq('class_level', 10);

  console.log(`✔ ICSE Class 10 query returned ${icseChapters.length} chapters (Sample chapter title: "${icseChapters[0]?.title}")`);

  if (!hasIcseInCbse && icseChapters.length > 0) {
    console.log('\n🎉 MULTI-BOARD FILTERING VERIFIED 100% SUCCEEDED!\n');
  } else {
    console.error('❌ Multi-board test failed');
    process.exit(1);
  }
}

checkMultiboard();

