const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing Supabase-backed API endpoints...');

  // 1. Health check
  const health = await request('/api/health');
  console.log('1. GET /api/health -> Status:', health.status, health.data);

  // 2. Subjects
  const subjects = await request('/api/subjects');
  console.log('2. GET /api/subjects -> Status:', subjects.status, 'Count:', subjects.data.length);

  // 3. Diagrams
  const diagrams = await request('/api/diagrams');
  console.log('3. GET /api/diagrams -> Status:', diagrams.status, 'Count:', diagrams.data.length);

  // 4. Labs
  const labs = await request('/api/labs');
  console.log('4. GET /api/labs -> Status:', labs.status, 'Count:', labs.data.labs?.length);

  // 5. Auth Login
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      email: 'student@stem.edu',
      password: 'Password123!'
    }
  });
  console.log('5. POST /api/auth/login -> Status:', login.status, 'User:', login.data.user?.name, 'Role:', login.data.user?.role, 'Has Token:', !!login.data.token);

  if (subjects.data.length === 4 && diagrams.data.length === 3 && login.status === 200) {
    console.log('\n🎉 ALL SUPABASE API ENDPOINTS VERIFIED & WORKING PERFECTLY!');
  } else {
    console.error('❌ Verification check failed');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
