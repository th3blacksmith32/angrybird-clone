import db from '../database.js';
import { signToken } from './authMiddleware.js';

export function signup(req, res) {
  const { email, password } = req.body;
  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'exists' });
  const user = { userId: Date.now(), email, password, telegramId: null, telegramUsername: null, subscription: 'free', tonBalance: 0, unlocked: [], bans: false, lastLogin: Date.now() };
  db.users.push(user);
  res.json({ token: signToken({ userId: user.userId, email }) });
}

export function login(req, res) {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'invalid' });
  user.lastLogin = Date.now();
  res.json({ token: signToken({ userId: user.userId, email, admin: user.admin }) });
}

export function telegramLogin(req, res) {
  const { telegramId, username } = req.body;
  let user = db.users.find(u => u.telegramId === telegramId);
  if (!user) {
    user = { userId: Date.now(), telegramId, telegramUsername: username, subscription: 'free', tonBalance: 0, unlocked: [], bans: false, lastLogin: Date.now() };
    db.users.push(user);
  }
  res.json({ token: signToken({ userId: user.userId, telegramId }) });
}

export function refresh(req, res) {
  const { userId } = req.body;
  res.json({ token: signToken({ userId }) });
}
