const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const { supabaseAdmin } = require('./utils/supabaseAdmin');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Log Supabase initialization status
if (supabaseAdmin) {
  console.log('⚡ Supabase client initialized (PostgreSQL + Auth + pgvector)');
} else {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in backend/.env');
}

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes index (Task 1.4)
app.use('/api', routes);

// 404 Not Found handler for unmapped routes
app.use(notFoundHandler);

// Central error-handling middleware (Task 1.5)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = { app, server };
