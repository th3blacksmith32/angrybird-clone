import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {
    this.load.json('achievements', 'achievements/achievements.json');
    this.load.json('level1', 'levels/level1.json');
    this.load.json('level2', 'levels/level2.json');
    this.load.json('random_demo', 'levels/random_demo.json');
  }
  create() {
    this.scene.start('PreloadScene');
  }
}
