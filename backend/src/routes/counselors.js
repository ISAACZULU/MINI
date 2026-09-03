import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Real counselor accounts a student can pick from when booking a session.
// Counselor role is only ever granted at signup by an admin (or the seed
// script) — never self-selected — so this list is trustworthy.
router.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, license_id')
    .eq('role', 'counselor')
    .order('display_name', { ascending: true });

  if (error) return res.status(500).json({ error: 'Could not load counselors.' });

  res.json({
    counselors: (data || []).map(c => ({ id: c.id, displayName: c.display_name, licenseId: c.license_id }))
  });
});

export default router;
