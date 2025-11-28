import db from '../database.js';
import fs from 'fs';

export function uploadLevel(req, res) {
  const { levelName, data } = req.body;
  db.levels[levelName] = data;
  fs.writeFileSync(`levels/${levelName}.json`, JSON.stringify(data, null, 2));
  res.json({ uploaded: levelName });
}

export function listLevels(req, res) {
  const files = fs.readdirSync('levels').filter(f => f.endsWith('.json'));
  res.json(files);
}

export function getLevel(req, res) {
  const name = req.params.levelName;
  if (db.levels[name]) return res.json(db.levels[name]);
  try {
    const file = fs.readFileSync(`levels/${name}.json`);
    return res.send(file);
  } catch (e) {
    return res.status(404).json({ error: 'not found' });
  }
}
