import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';
import { analyzeTextRisk } from '../utils/riskAnalyzer.js';
import { anonAliasFor } from '../utils/alias.js';

const router = Router();

function formatPost(post, replies, supports, reactions, userId) {
  const postReplies = replies.filter(r => r.post_id === post.id).map(r => ({
    id: r.id,
    author: r.author,
    isCounselor: r.is_counselor,
    text: r.text,
    createdAt: r.created_at
  }));

  const postSupports = supports.filter(s => s.post_id === post.id);
  const reactionsMap = {};
  reactions.filter(r => r.post_id === post.id).forEach(r => {
    reactionsMap[r.reaction_type] = (reactionsMap[r.reaction_type] || 0) + 1;
  });

  return {
    id: post.id,
    authorId: post.author_id,
    title: post.title,
    content: post.content,
    tag: post.tag,
    author: post.author_name,
    isAnonymous: post.is_anonymous,
    createdAt: post.created_at,
    moderationStatus: post.moderation_status,
    riskAnalysis: {
      riskLevel: post.risk_level,
      score: post.risk_score,
      isCrisis: post.risk_level === 'CRISIS'
    },
    supportCount: postSupports.length,
    isSupported: postSupports.some(s => s.user_id === userId),
    reactions: reactionsMap,
    replyCount: postReplies.length,
    replies: postReplies
  };
}

router.get('/', requireAuth, async (req, res) => {
  const [{ data: posts, error }, { data: replies }, { data: supports }, { data: reactions }] = await Promise.all([
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase.from('replies').select('*').order('created_at', { ascending: true }),
    supabase.from('post_supports').select('*'),
    supabase.from('post_reactions').select('*')
  ]);

  if (error) return res.status(500).json({ error: 'Could not load posts.' });

  res.json({
    posts: (posts || []).map(p => formatPost(p, replies || [], supports || [], reactions || [], req.user.id))
  });
});

router.post('/', requireAuth, async (req, res) => {
  const { title, content, tag, isAnonymous } = req.body || {};
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'A title and message are required.' });
  }

  const risk = analyzeTextRisk(title, content);
  const authorName = isAnonymous ? anonAliasFor(req.user.id) : req.user.displayName;

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{
      author_id: req.user.id,
      author_name: authorName,
      is_anonymous: !!isAnonymous,
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'General',
      risk_level: risk.riskLevel,
      risk_score: risk.score
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not create post.' });

  await supabase.from('clinical_analytics').insert([{
    event_type: 'POST_TRIAGE',
    post_id: post.id,
    risk_level: risk.riskLevel,
    risk_score: risk.score
  }]);

  res.status(201).json({ post: formatPost(post, [], [], [], req.user.id), riskAnalysis: { ...risk } });
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { title, content } = req.body || {};
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'A title and message are required.' });
  }

  const { data: existing } = await supabase.from('posts').select('author_id').eq('id', req.params.id).maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Post not found.' });
  if (existing.author_id !== req.user.id) return res.status(403).json({ error: 'You can only edit your own posts.' });

  const { error } = await supabase.from('posts').update({ title: title.trim(), content: content.trim() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: 'Could not update post.' });

  res.json({ ok: true });
});

router.post('/:id/support', requireAuth, async (req, res) => {
  const postId = req.params.id;
  const { data: existing } = await supabase
    .from('post_supports')
    .select('id')
    .match({ post_id: postId, user_id: req.user.id })
    .maybeSingle();

  if (existing) {
    await supabase.from('post_supports').delete().eq('id', existing.id);
    return res.json({ isSupported: false });
  }

  const { error } = await supabase.from('post_supports').insert([{ post_id: postId, user_id: req.user.id }]);
  if (error) return res.status(500).json({ error: 'Could not register support.' });
  res.json({ isSupported: true });
});

router.post('/:id/reactions', requireAuth, async (req, res) => {
  const { reactionType } = req.body || {};
  if (!reactionType) return res.status(400).json({ error: 'reactionType is required.' });

  const { error } = await supabase
    .from('post_reactions')
    .upsert([{ post_id: req.params.id, user_id: req.user.id, reaction_type: reactionType }], {
      onConflict: 'post_id,user_id,reaction_type',
      ignoreDuplicates: true
    });

  if (error) return res.status(500).json({ error: 'Could not save reaction.' });
  res.json({ ok: true });
});

router.post('/:id/replies', requireAuth, async (req, res) => {
  const { text } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ error: 'Reply text is required.' });

  const isCounselor = req.user.role === 'counselor';
  const author = isCounselor ? req.user.displayName : anonAliasFor(req.user.id);

  const { data: reply, error } = await supabase
    .from('replies')
    .insert([{ post_id: req.params.id, author_id: req.user.id, author, is_counselor: isCounselor, text: text.trim() }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not post reply.' });

  res.status(201).json({
    reply: { id: reply.id, author: reply.author, isCounselor: reply.is_counselor, text: reply.text, createdAt: reply.created_at }
  });
});

router.post('/:id/reveal', requireAuth, async (req, res) => {
  const { data: existing } = await supabase.from('posts').select('author_id').eq('id', req.params.id).maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Post not found.' });
  if (existing.author_id !== req.user.id) return res.status(403).json({ error: 'You can only reveal your own posts.' });

  await supabase.from('posts').update({ is_anonymous: false, author_name: req.user.displayName }).eq('id', req.params.id);
  await supabase.from('replies').update({ author: req.user.displayName }).match({ post_id: req.params.id, author_id: req.user.id });

  res.json({ ok: true });
});

export default router;
