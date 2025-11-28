import db from '../database.js';

export function balance(req, res) {
  const { userId } = req.query;
  const user = db.users.find(u => u.userId == userId);
  res.json({ tonBalance: user?.tonBalance || 0, pool: db.tonPool });
}

export function send(req, res) {
  const { destinationWalletAddress, amount } = req.body;
  db.tonPool = Math.max(0, db.tonPool - amount);
  res.json({ sent: amount, destinationWalletAddress });
}
