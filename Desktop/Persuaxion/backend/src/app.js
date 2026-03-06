require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const eventsRouter    = require('./routes/events');
const dashboardRouter = require('./routes/dashboard');
const sessionsRouter  = require('./routes/sessions');
const simulateRouter  = require('./routes/simulate');
const logger          = require('./middleware/logger');

const app = express();

// ── MIDDLEWARE ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ── SDK DISTRIBUTION ───────────────────────────────────────────
// Serves the built Persuaxion SDK JS file.
// Merchants install by adding <script src="[backend]/sdk.js"> to their theme.
//
// Headers:
//   Content-Type   — must be application/javascript (not text/html)
//   Cache-Control  — 1 hour public cache; Shopify CDN & browsers cache it
//   CORS           — must be * because requests come from any store domain
//   ETag           — handled automatically by express res.sendFile()
const SDK_PATH = path.join(__dirname, '../public/sdk.js');

app.get('/sdk.js', (_req, res) => {
  if (!fs.existsSync(SDK_PATH)) {
    return res.status(404).send('SDK not found');
  }
  res.set({
    'Content-Type':                'application/javascript; charset=utf-8',
    'Cache-Control':               'public, max-age=3600',
    'Access-Control-Allow-Origin': '*',
  });
  res.sendFile(SDK_PATH);
});

// ── ROUTES ─────────────────────────────────────────────────────
app.use('/api/events',    eventsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sessions',  sessionsRouter);
app.use('/api/simulate',  simulateRouter);

// Health check — used by Railway/Render uptime monitoring
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// ── START ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Persuaxion] Backend running on port ${PORT}`);
});

module.exports = app;
