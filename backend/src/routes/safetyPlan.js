import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const DEFAULT_PLAN = {
  trustedContact: 'Campus Wellness Advisor (Room 302)',
  copingStrategy: '4-7-8 Box Breathing & 5-minute walk',
  safePlace: 'Library 3rd Floor Quiet Corner',
  affirmation: 'I am resilient, and this exam stress is temporary.'
};

router.get('/', requireAuth, async (req, res) => {
  const { data } = await supabase.from('safety_plans').select('*').eq('user_id', req.user.id).maybeSingle();
  if (!data) return res.json({ safetyPlan: DEFAULT_PLAN });

  res.json({
    safetyPlan: {
      trustedContact: data.trusted_contact,
      copingStrategy: data.coping_strategy,
      safePlace: data.safe_place,
      affirmation: data.affirmation
    }
  });
});

router.put('/', requireAuth, async (req, res) => {
  const { trustedContact, copingStrategy, safePlace, affirmation } = req.body || {};

  const { error } = await supabase.from('safety_plans').upsert([{
    user_id: req.user.id,
    trusted_contact: trustedContact || '',
    coping_strategy: copingStrategy || '',
    safe_place: safePlace || '',
    affirmation: affirmation || '',
    updated_at: new Date().toISOString()
  }], { onConflict: 'user_id' });

  if (error) return res.status(500).json({ error: 'Could not save safety plan.' });
  res.json({ ok: true });
});

export default router;
