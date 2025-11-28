import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';
import LevelLoader from '../engine/LevelLoader.js';
import ProceduralGenerator from '../engine/ProceduralGenerator.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    this.add.text(20, 20, 'Main Menu', { fontSize: '24px', color: '#fff' });
    this.loader = new LevelLoader(this);
    this.generator = new ProceduralGenerator();
    const startLevel1 = this.add.text(20, 60, 'Play Level 1', { fontSize: '18px', color: '#ff0' }).setInteractive();
    startLevel1.on('pointerup', () => this.startLevel('level1'));
    const startLevel2 = this.add.text(20, 90, 'Play Level 2', { fontSize: '18px', color: '#ff0' }).setInteractive();
    startLevel2.on('pointerup', () => this.startLevel('level2'));
    const randomLevel = this.add.text(20, 120, 'Random Level', { fontSize: '18px', color: '#ff0' }).setInteractive();
    randomLevel.on('pointerup', () => {
      const lvl = this.generator.generate('medium');
      this.loader.saveProceduralLevel(lvl);
      this.startLevel(lvl.name);
    });
  }

  startLevel(key) {
    this.scene.start('LevelScene', { levelKey: key });
  }
}
