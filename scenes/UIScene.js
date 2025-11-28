import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';

export default class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }
  init(data) { this.score = data.score || 0; this.birds = data.birds || []; }
  create() {
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { fontSize: '18px', color: '#fff' }).setScrollFactor(0);
    this.birdText = this.add.text(10, 40, `Birds: ${this.birds.join(',')}`, { fontSize: '16px', color: '#fff' }).setScrollFactor(0);
    const restart = this.add.image(760, 20, 'restart').setInteractive().setScrollFactor(0);
    restart.on('pointerup', () => { this.scene.stop('LevelScene'); this.scene.start('LevelScene', { levelKey: 'level1' }); });
    this.scene.get('LevelScene').events.on('scoreUpdate', score => this.scoreText.setText(`Score: ${score}`));
    this.scene.get('LevelScene').events.on('birdQueued', (count, tier) => this.birdText.setText(`Birds left: ${count} (next ${tier})`));
  }
}
