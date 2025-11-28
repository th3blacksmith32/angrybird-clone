import db from '../database.js';
import PhysicsValidator from '../../engine/PhysicsValidator.js';

export function submit(req, res) {
  const { userId, score, shotReport } = req.body;
  const valid = PhysicsValidator.validateShot(shotReport || { initial: {}, vector: { x: 1, y: 1 }, pigsHit: 0, boxesBroken: 0 });
  if (!valid) return res.status(400).json({ error: 'suspicious' });
  db.scores.push({ userId, score, ts: Date.now() });
  res.json({ accepted: true });
}
