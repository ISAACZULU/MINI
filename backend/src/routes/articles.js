import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

function formatArticle(a) {
  return {
    id: a.id,
    title: a.title,
    category: a.category,
    readTime: a.read_time,
    author: a.author,
    summary: a.summary,
    content: a.content,
    createdAt: a.created_at
  };
}

router.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not load articles.' });
  res.json({ articles: (data || []).map(formatArticle) });
});

router.post('/', requireAuth, requireRole('counselor'), async (req, res) => {
  const { title, category, readTime, author, summary, content } = req.body || {};
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'title and content are required.' });
  }

  const { data, error } = await supabase
    .from('articles')
    .insert([{
      author_id: req.user.id,
      title: title.trim(),
      category: category || 'Burnout',
      read_time: readTime || '4 min read',
      author: author || req.user.displayName,
      summary: summary || '',
      content: content.trim()
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not publish article.' });

  await supabase.from('counselor_actions').insert([{ counselor_id: req.user.id, action_type: 'PUBLISH_ARTICLE', content_id: data.id }]);

  res.status(201).json({ article: formatArticle(data) });
});

export default router;
