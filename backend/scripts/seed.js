import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from '../src/config/supabaseClient.js';

// Demo accounts so the login screen's "Fill Demo Student / Fill Demo
// Counselor" shortcuts have real accounts to sign into. Counselor role is
// only ever granted here (or by hand in the DB) — never via self-registration.
const ACCOUNTS = [
  { email: 'jordan.rivera@st.knust.edu.gh', password: 'password123', displayName: 'Student Jordan Rivera', role: 'student' },
  { email: 's.jenkins@knust.edu.gh', password: 'counselorpass', displayName: 'Dr. Sarah Jenkins, LCSW', role: 'counselor', licenseId: 'LCSW-88492' },
  { email: 'm.peterson@knust.edu.gh', password: 'counselorpass', displayName: 'Dr. Mark Peterson, PsyD', role: 'counselor', licenseId: 'PsyD-44219' },
  { email: 'a.rivera@knust.edu.gh', password: 'counselorpass', displayName: 'Counselor Alex Rivera, MSW', role: 'counselor', licenseId: 'MSW-33921' }
];

async function seed() {
  for (const account of ACCOUNTS) {
    const { data: existing } = await supabase.from('users').select('id').eq('email', account.email).maybeSingle();
    if (existing) {
      console.log(`Skipping ${account.email} (already exists)`);
      continue;
    }

    const passwordHash = await bcrypt.hash(account.password, 10);
    const { error } = await supabase.from('users').insert([{
      email: account.email,
      password_hash: passwordHash,
      display_name: account.displayName,
      role: account.role,
      is_guest: false,
      license_id: account.licenseId || null
    }]);

    if (error) {
      console.error(`Failed to seed ${account.email}:`, error.message);
    } else {
      console.log(`Seeded ${account.role}: ${account.email} / ${account.password}`);
    }
  }
  process.exit(0);
}

seed();
