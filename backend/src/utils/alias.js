import crypto from 'crypto';

// Deterministic "Anon#XXXXXXXXXX" alias derived from a user's id, so a given
// account always shows the same anonymous handle instead of a new random one
// per post.
export function anonAliasFor(userId) {
  const hash = crypto.createHash('sha256').update(userId).digest('hex').toUpperCase();
  return `Anon#${hash.slice(0, 10)}`;
}
