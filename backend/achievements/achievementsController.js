import db from '../database.js';
import fs from 'fs';

const achievements = JSON.parse(fs.readFileSync('achievements/achievements.json'));

export function list(req, res) {
  res.json(achievements);
}

export function unlock(req, res) {
  const { userId, achievementId } = req.body;
  db.achievements[userId] = db.achievements[userId] || new Set();
  db.achievements[userId].add(achievementId);
  res.json({ unlocked: Array.from(db.achievements[userId]) });
}
