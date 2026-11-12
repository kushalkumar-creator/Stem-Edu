/**
 * migrateFromMongo.js: One-time migration script (SUPABASE_SETUP.md Section 9)
 * Reads MongoDB seed data and writes directly to Supabase PostgreSQL tables.
 */
const migrate = require('./migrateToSupabase');

async function run() {
  console.log('Initiating migration from MongoDB seed definition into Supabase...');
  await migrate();
}

run();
