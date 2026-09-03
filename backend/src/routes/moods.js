import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Could not load mood logs.' });

  res.json({
    moodLogs: (data || []).map(m => ({
      id: m.id,
      moodLevel: m.mood_score,
      triggers: m.mood_label ? m.mood_label.split(', ') : [],
      note: m.note || '',
      createdAt: m.created_at
    }))
  });
});

router.post('/', requireAuth, async (req, res) => {
  const { moodLevel, triggers, note } = req.body || {};
  if (!moodLevel || moodLevel < 1 || moodLevel > 5) {
    return res.status(400).json({ error: 'moodLevel must be between 1 and 5.' });
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .insert([{
      user_id: req.user.id,
      mood_score: moodLevel,
      mood_label: Array.isArray(triggers) && triggers.length > 0 ? triggers.join(', ') : 'Daily Check-in',
      note: note || ''
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not save mood log.' });

  const { count } = await supabase
    .from('mood_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', req.user.id);

  res.status(201).json({
    moodLog: { id: data.id, moodLevel: data.mood_score, triggers: triggers || [], note: data.note, createdAt: data.created_at },
    streakCount: count || 1
  });
});

export default router;
