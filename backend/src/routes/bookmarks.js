import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('bookmarks').select('resource_id').eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'Could not load bookmarks.' });
  res.json({ bookmarks: (data || []).map(b => b.resource_id) });
});

router.post('/', requireAuth, async (req, res) => {
  const { resourceId } = req.body || {};
  if (!resourceId) return res.status(400).json({ error: 'resourceId is required.' });

  const { error } = await supabase.from('bookmarks').upsert([{ user_id: req.user.id, resource_id: resourceId }], {
    onConflict: 'user_id,resource_id',
    ignoreDuplicates: true
  });
  if (error) return res.status(500).json({ error: 'Could not save bookmark.' });
  res.status(201).json({ ok: true });
});

router.delete('/:resourceId', requireAuth, async (req, res) => {
  const { error } = await supabase.from('bookmarks').delete().match({ user_id: req.user.id, resource_id: req.params.resourceId });
  if (error) return res.status(500).json({ error: 'Could not remove bookmark.' });
  res.json({ ok: true });
});

export default router;
