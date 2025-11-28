import db from '../database.js';

export function saveProgress(req, res) {
  const { userId, progress } = req.body;
  db.saves = db.saves || {};
  db.saves[userId] = progress;
  res.json({ ok: true });
}

export function loadProgress(req, res) {
  const { userId } = req.query;
  res.json({ progress: db.saves?.[userId] || {} });
}
