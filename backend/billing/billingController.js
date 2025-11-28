import db from '../database.js';

export function subscribe(req, res) {
  const user = db.users.find(u => u.userId === req.body.userId);
  if (!user) return res.status(404).json({ error: 'user' });
  user.subscription = 'premium';
  res.json({ status: 'subscribed' });
}

export function cancel(req, res) {
  const user = db.users.find(u => u.userId === req.body.userId);
  if (!user) return res.status(404).json({ error: 'user' });
  user.subscription = 'free';
  res.json({ status: 'canceled' });
}

export function status(req, res) {
  const user = db.users.find(u => u.userId == req.query.userId);
  res.json({ subscription: user?.subscription || 'free' });
}
