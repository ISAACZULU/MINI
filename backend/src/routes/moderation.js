import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/flagged', requireAuth, requireRole('counselor'), async (_req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .in('risk_level', ['CRISIS', 'HIGH'])
    .neq('moderation_status', 'cleared')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Could not load flagged threads.' });

  res.json({
    flaggedPosts: (data || []).map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      tag: p.tag,
      author: p.author_name,
      riskAnalysis: { riskLevel: p.risk_level, score: p.risk_score }
    }))
  });
});

router.post('/:postId/clear', requireAuth, requireRole('counselor'), async (req, res) => {
  const { error } = await supabase.from('posts').update({ moderation_status: 'cleared' }).eq('id', req.params.postId);
  if (error) return res.status(500).json({ error: 'Could not clear flag.' });

  await supabase.from('counselor_actions').insert([{ counselor_id: req.user.id, action_type: 'CLEAR_FLAG', content_id: req.params.postId }]);

  res.json({ ok: true });
});

export default router;
