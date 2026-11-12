const rateLimit = require('express-rate-limit');

/**
 * In-memory AI usage counters for tracking demo limits
 */
const usageMetrics = {
  dailyGeminiCalls: 0,
  lastReset: new Date().toDateString(),
  increment() {
    const today = new Date().toDateString();
    if (this.lastReset !== today) {
      this.dailyGeminiCalls = 0;
      this.lastReset = today;
    }
    this.dailyGeminiCalls += 1;
    return this.dailyGeminiCalls;
  },
  getMetrics() {
    return {
      dailyCalls: this.dailyGeminiCalls,
      dailyLimit: 1500, // Gemini free tier daily RPM / RPD boundary
      date: this.lastReset
    };
  }
};

/**
 * AI Rate Limiter Middleware
 * Protects Gemini endpoints (/api/mentor/*, /api/lessons/:id/summary, /api/rag/*)
 */
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each user / IP to 30 AI queries per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return (req.user && req.user.id) || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'You have reached the AI query limit for this window. Please wait a few minutes before asking Saarthi again.'
    });
  }
});

module.exports = {
  aiRateLimiter,
  usageMetrics
};

