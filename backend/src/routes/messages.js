import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Students only ever see their own thread(s). Counselors see every thread
// addressed to their counselor_name (their seeded display name doubles as
// the routing key, matching how appointments/booking already label them).
router.get('/', requireAuth, async (req, res) => {
  let query = supabase.from('direct_messages').select('*').order('created_at', { ascending: true });
  if (req.user.role === 'counselor') {
    query = query.ilike('counselor_name', `%${req.user.displayName.split(',')[0]}%`);
  } else {
    query = query.eq('student_id', req.user.id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Could not load messages.' });

  // Grouped by (counselor, real student id) so one accountable thread exists
  // per student-counselor pair even if some messages were sent anonymously;
  // the alias shown just reflects whichever name was used most recently.
  const chatsByKey = {};
  (data || []).forEach(dm => {
    const key = `${dm.counselor_name}||${dm.student_id}`;
    if (!chatsByKey[key]) {
      chatsByKey[key] = {
        id: key,
        counselorName: dm.counselor_name,
        studentAlias: dm.student_alias,
        studentId: dm.student_id,
        messages: []
      };
    }
    chatsByKey[key].studentAlias = dm.student_alias;
    chatsByKey[key].messages.push({
      id: dm.id,
      sender: dm.sender_type,
      text: dm.message_text,
      timestamp: new Date(dm.created_at).getTime()
    });
  });

  res.json({ chats: Object.values(chatsByKey) });
});

router.post('/', requireAuth, async (req, res) => {
  const { counselorName, text, studentId, studentAlias } = req.body || {};
  if (!counselorName || !text?.trim()) {
    return res.status(400).json({ error: 'counselorName and text are required.' });
  }

  const isCounselor = req.user.role === 'counselor';
  if (isCounselor && !studentId) {
    return res.status(400).json({ error: 'studentId is required when a counselor sends a message.' });
  }

  const { data, error } = await supabase
    .from('direct_messages')
    .insert([{
      student_id: isCounselor ? studentId : req.user.id,
      student_alias: isCounselor ? (studentAlias || 'Student') : (studentAlias || req.user.displayName),
      counselor_name: counselorName,
      sender_type: isCounselor ? 'counselor' : 'student',
      message_text: text.trim()
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not send message.' });

  res.status(201).json({
    message: { id: data.id, sender: data.sender_type, text: data.message_text, timestamp: new Date(data.created_at).getTime() }
  });
});

export default router;
