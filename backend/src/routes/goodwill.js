import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const COLOR_OPTIONS = [
  { color: 'rgba(20, 184, 166, 0.08)', textColor: '#0d9488' },
  { color: 'rgba(99, 102, 241, 0.08)', textColor: '#4f46e5' },
  { color: 'rgba(245, 158, 11, 0.08)', textColor: '#d97706' }
];

function formatGoodwill(g) {
  return { id: g.id, text: g.text, author: g.author, role: g.role, color: g.color, textColor: g.text_color, createdAt: g.created_at };
}

router.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from('goodwill_messages').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not load goodwill messages.' });
  res.json({ goodwillMessages: (data || []).map(formatGoodwill) });
});

router.post('/', requireAuth, requireRole('counselor'), async (req, res) => {
  const { text, author, role } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ error: 'text is required.' });

  const picked = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];

  const { data, error } = await supabase
    .from('goodwill_messages')
    .insert([{
      author_id: req.user.id,
      text: text.trim(),
      author: author || req.user.displayName,
      role: role || '',
      color: picked.color,
      text_color: picked.textColor
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not publish goodwill message.' });

  await supabase.from('counselor_actions').insert([{ counselor_id: req.user.id, action_type: 'PUBLISH_GOODWILL', content_id: data.id }]);

  res.status(201).json({ goodwill: formatGoodwill(data) });
});

export default router;
