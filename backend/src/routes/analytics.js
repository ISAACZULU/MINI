import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/overview', requireAuth, requireRole('counselor'), async (_req, res) => {
  const { data: posts, error } = await supabase.from('posts').select('tag, risk_level, created_at');
  if (error) return res.status(500).json({ error: 'Could not load analytics.' });

  const categoryCounts = {};
  (posts || []).forEach(p => {
    categoryCounts[p.tag] = (categoryCounts[p.tag] || 0) + 1;
  });

  // Real 7-day trend, computed from actual post timestamps instead of mock numbers.
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const trend = days.map(d => {
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = (posts || []).filter(p => {
      const created = new Date(p.created_at);
      return created.toDateString() === d.toDateString();
    }).length;
    return { day: dayLabel, count };
  });

  const crisisCount = (posts || []).filter(p => p.risk_level === 'CRISIS').length;
  const highRiskCount = (posts || []).filter(p => p.risk_level === 'HIGH').length;

  const { count: appointmentsCount } = await supabase.from('appointments').select('id', { count: 'exact', head: true });

  res.json({
    categoryCounts,
    trend,
    totalPosts: (posts || []).length,
    crisisCount,
    highRiskCount,
    appointmentsCount: appointmentsCount || 0
  });
});

export default router;
