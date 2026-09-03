import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/auth.js';
import postsRoutes from './src/routes/posts.js';
import moodsRoutes from './src/routes/moods.js';
import appointmentsRoutes from './src/routes/appointments.js';
import counselorsRoutes from './src/routes/counselors.js';
import messagesRoutes from './src/routes/messages.js';
import articlesRoutes from './src/routes/articles.js';
import goodwillRoutes from './src/routes/goodwill.js';
import safetyPlanRoutes from './src/routes/safetyPlan.js';
import feedbackRoutes from './src/routes/feedback.js';
import bookmarksRoutes from './src/routes/bookmarks.js';
import analyticsRoutes from './src/routes/analytics.js';
import moderationRoutes from './src/routes/moderation.js';
import aiRoutes from './src/routes/ai.js';

const app = express();

app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(',') }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/counselors', counselorsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/goodwill', goodwillRoutes);
app.use('/api/safety-plan', safetyPlanRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Haven KNUST backend listening on http://localhost:${port}`);
});
