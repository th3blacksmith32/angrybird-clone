export default class LevelLoader {
  constructor(scene) { this.scene = scene; }
  loadLevel(key) {
    const data = this.scene.cache.json.get(key);
    if (!data) throw new Error('Level not found: ' + key);
    return data;
  }
  saveProceduralLevel(level) {
    const blob = new Blob([JSON.stringify(level, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = level.name + '.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}
