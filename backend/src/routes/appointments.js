import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';
import { anonAliasFor } from '../utils/alias.js';

const router = Router();

function formatAppt(a) {
  return {
    id: a.id,
    counselorId: a.counselor_id,
    counselorName: a.counselor_name,
    studentAlias: a.student_alias,
    date: a.appointment_date,
    timeSlot: a.time_slot,
    mode: a.mode,
    status: a.status,
    topic: a.topic,
    meetingUrl: a.meeting_url,
    createdAt: a.created_at
  };
}

// Students see only their own bookings; counselors see only sessions
// booked with them specifically (never every student's appointments).
router.get('/', requireAuth, async (req, res) => {
  let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });
  query = req.user.role === 'counselor'
    ? query.eq('counselor_id', req.user.id)
    : query.eq('student_id', req.user.id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Could not load appointments.' });
  res.json({ appointments: (data || []).map(formatAppt) });
});

// Booking is student-initiated only. The counselor is looked up server-side
// by id (never trusting a client-supplied name) so a session can only ever
// be booked with a real counselor account.
router.post('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can book counseling sessions.' });
  }

  const { counselorId, date, timeSlot, topic, mode, isAnonymous } = req.body || {};
  if (!counselorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'counselorId, date, and timeSlot are required.' });
  }

  const { data: counselor } = await supabase
    .from('users')
    .select('id, display_name, role')
    .eq('id', counselorId)
    .maybeSingle();

  if (!counselor || counselor.role !== 'counselor') {
    return res.status(400).json({ error: 'Selected counselor was not found.' });
  }

  const roomId = `haven-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const meetingUrl = `https://demo.daily.co/${roomId}`;

  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      student_id: req.user.id,
      student_alias: isAnonymous ? anonAliasFor(req.user.id) : req.user.displayName,
      counselor_id: counselor.id,
      counselor_name: counselor.display_name,
      appointment_date: date,
      time_slot: timeSlot,
      mode: mode || 'Telehealth Video',
      topic: topic || 'General Consultation',
      status: 'Confirmed',
      meeting_url: meetingUrl
    }])
    .select()
    .single();

  if (error) { console.error('book appointment error:', error); return res.status(500).json({ error: 'Could not book appointment.' }); }
  res.status(201).json({ appointment: formatAppt(data) });
});

export default router;
