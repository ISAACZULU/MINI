import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = Router();

// Public: the landing page shows/collects testimonials before anyone logs in.
router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) { console.error('feedback GET error:', error); return res.status(500).json({ error: 'Could not load feedback.' }); }
  res.json({ feedbacks: (data || []).map(f => ({ text: f.text, author: f.author_name || 'Anonymous Student', rating: f.rating })) });
});

router.post('/', async (req, res) => {
  const { rating, text, authorName } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ error: 'text is required.' });

  const { data, error } = await supabase
    .from('feedbacks')
    .insert([{ rating: rating || 5, text: text.trim(), author_name: authorName?.trim() || 'Anonymous Student' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not save feedback.' });
  res.status(201).json({ feedback: { text: data.text, author: data.author_name, rating: data.rating } });
});

export default router;
