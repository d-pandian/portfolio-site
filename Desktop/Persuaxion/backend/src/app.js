require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const eventsRouter    = require('./routes/events');
const dashboardRouter = require('./routes/dashboard');
const sessionsRouter  = require('./routes/sessions');

const app = express();

// ── MIDDLEWARE ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── ROUTES ─────────────────────────────────────────────────────
app.use('/api/events',    eventsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sessions',  sessionsRouter);

// Health check — used by Railway/Render uptime monitoring
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// ── START ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Persuaxion] Backend running on port ${PORT}`);
});

module.exports = app;
