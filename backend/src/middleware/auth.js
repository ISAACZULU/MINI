import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, displayName: user.display_name, isGuest: user.is_guest },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      displayName: payload.displayName,
      isGuest: payload.isGuest
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `This action requires the '${role}' role.` });
    }
    next();
  };
}
