import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'secret';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch (e) { return res.status(401).json({ error: 'invalid token' }); }
}

export const signToken = payload => jwt.sign(payload, secret, { expiresIn: '2h' });
