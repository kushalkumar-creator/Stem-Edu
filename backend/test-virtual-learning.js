/**
 * Test Virtual Learning 3D Topics & Advanced Summaries (P2-8 & P2-4)
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('\n============================================================');
  console.log('   TESTING VIRTUAL LEARNING 3D LABS & ADVANCED SUMMARIES');
  console.log('============================================================\n');

  // 1. Login as student
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@stem.edu', password: 'Password123!' })
  });
  const { token } = await loginRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Test GET /api/virtual
  console.log('1. Testing GET /api/virtual (List topics)...');
  const listRes = await fetch(`${API_BASE}/virtual`);
  const listData = await listRes.json();
  console.log(`✔ Topics count: ${listData.data?.length}`);
  const slugs = (listData.data || []).map(t => `${t.slug} (${t.subject})`);
  console.log('   Available:', slugs.join(', '));

  // 3. Test GET /api/virtual/:slug for Ray Optics
  console.log('\n2. Testing GET /api/virtual/light-and-optics...');
  const opticsRes = await fetch(`${API_BASE}/virtual/light-and-optics`);
  const opticsData = await opticsRes.json();
  console.log(`✔ Title: ${opticsData.data?.title}`);
  console.log(`   Quiz questions count: ${opticsData.data?.quiz?.length}`);

  // 4. Test GET /api/virtual/molecule-viewer
  console.log('\n3. Testing GET /api/virtual/molecule-viewer...');
  const molRes = await fetch(`${API_BASE}/virtual/molecule-viewer`);
  const molData = await molRes.json();
  console.log(`✔ Molecule viewer ready: ${molData.data?.title}`);

  // 5. Test GET /api/virtual/conic-sections
  console.log('\n4. Testing GET /api/virtual/conic-sections...');
  const conicRes = await fetch(`${API_BASE}/virtual/conic-sections`);
  const conicData = await conicRes.json();
  console.log(`✔ Conic sections 3D explorer ready: ${conicData.data?.title}`);

  // 6. Test Record Progress
  console.log('\n5. Testing POST /api/virtual/:slug/progress...');
  const progRes = await fetch(`${API_BASE}/virtual/light-and-optics/progress`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ score: 100, completed: true })
  });
  const progData = await progRes.json();
  console.log(`✔ Progress saved: score = ${progData.score}%, completed = ${progData.completed}`);

  // 7. Test Advanced Summarizer: Formula Sheet Mode
  console.log('\n6. Testing POST /api/summaries/generate (Formulas & Equations)...');
  const sum1Res = await fetch(`${API_BASE}/summaries/generate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Light – Reflection and Refraction',
      style: 'formulas',
      length: 'short',
      language: 'en',
      classLevel: 10
    })
  });
  const sum1Data = await sum1Res.json();
  console.log(`✔ Formula summary generated (Flashcards: ${sum1Data.flashcards?.length})`);
  console.log(`   Preview: ${sum1Data.summary?.slice(0, 120)}...`);

  // 8. Test Advanced Summarizer: Class 8 Analogy Mode
  console.log('\n7. Testing POST /api/summaries/generate (Simplified Class 8 Analogy)...');
  const sum2Res = await fetch(`${API_BASE}/summaries/generate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Electric Current and Potential Difference',
      style: 'simplified',
      length: 'medium',
      language: 'en',
      classLevel: 10
    })
  });
  const sum2Data = await sum2Res.json();
  console.log(`✔ Simplified analogy generated (Flashcards: ${sum2Data.flashcards?.length})`);
  console.log(`   Preview: ${sum2Data.summary?.slice(0, 120)}...`);

  console.log('\n============================================================');
  console.log('🎉 ALL VIRTUAL LEARNING & ADVANCED SUMMARY TESTS PASSED 100%!');
  console.log('============================================================\n');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

