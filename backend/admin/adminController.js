import db from '../database.js';

export function listUsers(req, res) {
  res.json(db.users.map(u => ({ userId: u.userId, telegramId: u.telegramId, telegramUsername: u.telegramUsername, subscription: u.subscription, tonBalance: u.tonBalance, lastLogin: u.lastLogin, ban: u.bans })));
}

export function ban(req, res) {
  const user = db.users.find(u => u.userId === req.body.userId);
  if (!user) return res.status(404).json({ error: 'not found' });
  user.bans = true;
  res.json({ banned: true });
}

export function unban(req, res) {
  const user = db.users.find(u => u.userId === req.body.userId);
  if (!user) return res.status(404).json({ error: 'not found' });
  user.bans = false;
  res.json({ banned: false });
}

export function grantItems(req, res) {
  const { userId, items } = req.body;
  const user = db.users.find(u => u.userId === userId);
  if (!user) return res.status(404).json({ error: 'not found' });
  user.unlocked.push(...items);
  res.json({ unlocked: user.unlocked });
}

export function sendTon(req, res) {
  const { destinationWalletAddress, amount } = req.body;
  db.tonPool = Math.max(0, db.tonPool - amount);
  res.json({ pool: db.tonPool, destinationWalletAddress });
}
