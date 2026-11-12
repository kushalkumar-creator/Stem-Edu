const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');
const feExamplePath = path.join(rootDir, 'frontend/.env.example');
const feEnvPath = path.join(rootDir, 'frontend/.env');
const beEnvPath = path.join(rootDir, 'backend/.env');

if (fs.existsSync(feExamplePath)) {
  const content = fs.readFileSync(feExamplePath, 'utf8');
  let supabaseUrl = '';
  let supabaseAnon = '';

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.substring('VITE_SUPABASE_URL='.length).trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnon = trimmed.substring('VITE_SUPABASE_ANON_KEY='.length).trim();
    }
  }

  if (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT_REF')) {
    console.log('Found Supabase URL:', supabaseUrl.substring(0, 25) + '...');
  }
  if (supabaseAnon) {
    console.log('Found Supabase Anon Key (length):', supabaseAnon.length);
  }

  if (supabaseUrl && supabaseAnon && !supabaseUrl.includes('YOUR_PROJECT_REF')) {
    // Write frontend/.env
    const feEnvContent = [
      'VITE_API_URL=http://localhost:5000',
      `VITE_SUPABASE_URL=${supabaseUrl}`,
      `VITE_SUPABASE_ANON_KEY=${supabaseAnon}`,
      ''
    ].join('\n');
    fs.writeFileSync(feEnvPath, feEnvContent, 'utf8');
    console.log('✔ Created frontend/.env');

    // Reset frontend/.env.example to placeholders
    const feCleanExample = [
      'VITE_API_URL=http://localhost:5000',
      'VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co',
      'VITE_SUPABASE_ANON_KEY=',
      'VITE_DISCORD_INVITE_URL=',
      'VITE_DISCORD_SERVER_ID=',
      ''
    ].join('\n');
    fs.writeFileSync(feExamplePath, feCleanExample, 'utf8');
    console.log('✔ Cleaned frontend/.env.example (protected secrets from git)');

    // Update backend/.env
    let beEnvContent = fs.existsSync(beEnvPath) ? fs.readFileSync(beEnvPath, 'utf8') : '';
    const hasUrl = beEnvContent.includes('SUPABASE_URL=');
    const hasAnon = beEnvContent.includes('SUPABASE_ANON_KEY=');
    const hasService = beEnvContent.includes('SUPABASE_SERVICE_ROLE_KEY=');

    if (!hasUrl) beEnvContent += `\nSUPABASE_URL=${supabaseUrl}`;
    else beEnvContent = beEnvContent.replace(/SUPABASE_URL=.*/, `SUPABASE_URL=${supabaseUrl}`);

    if (!hasAnon) beEnvContent += `\nSUPABASE_ANON_KEY=${supabaseAnon}`;
    else beEnvContent = beEnvContent.replace(/SUPABASE_ANON_KEY=.*/, `SUPABASE_ANON_KEY=${supabaseAnon}`);

    if (!hasService) beEnvContent += `\nSUPABASE_SERVICE_ROLE_KEY=`;

    fs.writeFileSync(beEnvPath, beEnvContent, 'utf8');
    console.log('✔ Updated backend/.env with SUPABASE_URL and SUPABASE_ANON_KEY');
  }
}

