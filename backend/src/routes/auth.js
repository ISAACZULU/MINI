import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/supabaseClient.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { anonAliasFor } from '../utils/alias.js';

const router = Router();

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    role: u.role,
    isGuest: u.is_guest,
    licenseId: u.license_id || null
  };
}

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'A valid email and a password of at least 6 characters are required.' });
  }

  const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).maybeSingle();
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      email: email.toLowerCase(),
      password_hash: passwordHash,
      display_name: displayName?.trim() || email.split('@')[0],
      role: 'student',
      is_guest: false
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not create account.' });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// Anonymous "Visitor" entry — still provisions a real backend account (so
// posts/likes/mood logs have somewhere real to live), it's just created
// instantly with no form to fill in, and labelled with an Anon# alias.
router.post('/guest', async (_req, res) => {
  const randomId = crypto.randomUUID();
  const password = crypto.randomBytes(16).toString('hex');
  const passwordHash = await bcrypt.hash(password, 10);
  const email = `guest-${randomId}@haven.local`;

  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      email,
      password_hash: passwordHash,
      display_name: 'Visitor',
      role: 'student',
      is_guest: true
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not start a guest session.' });

  const alias = anonAliasFor(user.id);
  await supabase.from('users').update({ display_name: alias }).eq('id', user.id);
  user.display_name = alias;

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data: user } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).maybeSingle();
  if (error || !user) return res.status(404).json({ error: 'Account not found.' });
  res.json({ user: publicUser(user) });
});

export default router;
