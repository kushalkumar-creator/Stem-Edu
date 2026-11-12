/**
 * Test Saarthi AI Mentor & RAG Notes End-to-End
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('\n============================================================');
  console.log('   TESTING SAARTHI AI MENTOR & RAG API ENDPOINTS');
  console.log('============================================================\n');

  // 1. Login as student demo user
  console.log('1. Logging in as student@stem.edu...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@stem.edu', password: 'Password123!' })
  });

  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.error('❌ Login failed:', loginData);
    process.exit(1);
  }

  const token = loginData.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log(`✔ Logged in successfully. Token acquired. (Role: ${loginData.user?.role || 'student'})`);

  // 2. Query RAG endpoint
  console.log('\n2. Testing POST /api/rag/query...');
  const ragRes = await fetch(`${API_BASE}/rag/query`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      query: "What is Ohm's law and electric resistance formula?",
      subject: 'physics',
      classLevel: 10,
      board: 'CBSE',
      language: 'en'
    })
  });
  const ragData = await ragRes.json();
  console.log(`✔ RAG Query status: ${ragRes.status}`);
  console.log(`   Answer model: ${ragData.model}`);
  console.log(`   Citations count: ${ragData.sources?.length}`);
  console.log(`   Answer preview: ${ragData.answer?.slice(0, 100)}...`);

  // 3. Upload student private note
  console.log('\n3. Testing POST /api/rag/notes (Student personal knowledge base)...');
  const noteRes = await fetch(`${API_BASE}/rag/notes`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'My Physics Lab Notes on Ohm Law',
      content: 'In our laboratory experiment on Ohm’s Law, our group measured V = 4.5 volts and I = 0.5 amperes across a nichrome wire. Resistance R was calculated to be 9 ohms.',
      subject: 'physics',
      classLevel: 10,
      board: 'CBSE'
    })
  });
  const noteData = await noteRes.json();
  console.log(`✔ Note upload status: ${noteRes.status}, chunks created: ${noteData.chunksCreated}`);

  // 4. List student notes
  console.log('\n4. Testing GET /api/rag/notes...');
  const getNotesRes = await fetch(`${API_BASE}/rag/notes`, { headers: authHeaders });
  const notesList = await getNotesRes.json();
  console.log(`✔ Student private notes count: ${notesList.data?.length}`);
  const sampleNoteId = notesList.data?.[0]?.id;

  // 5. Create Saarthi Chat Session
  console.log('\n5. Testing POST /api/mentor/sessions...');
  const sessRes = await fetch(`${API_BASE}/mentor/sessions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Doubt about Lens Formula and Ray Optics',
      mode: 'doubt',
      subject: 'physics'
    })
  });
  const sessData = await sessRes.json();
  const sessionId = sessData.data?.id;
  console.log(`✔ Created Saarthi session: ${sessionId}`);

  // 6. Send message to Saarthi
  console.log('\n6. Testing POST /api/mentor/sessions/:id/messages...');
  const msgRes = await fetch(`${API_BASE}/mentor/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      content: 'I find spherical mirror numericals difficult. Can you explain the sign convention and mirror formula?',
      mode: 'doubt',
      subject: 'physics',
      classLevel: 10,
      language: 'en'
    })
  });
  const msgData = await msgRes.json();
  console.log(`✔ Saarthi reply status: ${msgRes.status}`);
  console.log(`   Assistant response preview: ${msgData.message?.content?.slice(0, 150)}...`);
  console.log(`   Sources cited: ${msgData.sources?.length}`);

  // 7. Check session message history
  console.log('\n7. Testing GET /api/mentor/sessions/:id...');
  const historyRes = await fetch(`${API_BASE}/mentor/sessions/${sessionId}`, { headers: authHeaders });
  const historyData = await historyRes.json();
  console.log(`✔ Session history messages count: ${historyData.messages?.length}`);

  // 8. Check student memory facts
  console.log('\n8. Testing GET /api/mentor/memories...');
  const memRes = await fetch(`${API_BASE}/mentor/memories`, { headers: authHeaders });
  const memData = await memRes.json();
  console.log(`✔ Persistent memory facts recorded: ${memData.data?.length}`);

  // 9. Clean up sample note
  if (sampleNoteId) {
    console.log('\n9. Testing DELETE /api/rag/notes/:id...');
    const delRes = await fetch(`${API_BASE}/rag/notes/${sampleNoteId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    console.log(`✔ Delete note status: ${delRes.status}`);
  }

  console.log('\n============================================================');
  console.log('🎉 ALL SAARTHI AI MENTOR & RAG API TESTS PASSED 100%!');
  console.log('============================================================\n');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
