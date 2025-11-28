import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';

const tierPower = { '1x': 0.9, '2x': 1.1, '3x': 1.2, '4x': 1.35, '5x': 1.5, '10x': 1.8, '30x': 2.1, '50x': 2.5 };

export default class Bird {
  constructor(scene, tier, x, y) {
    this.scene = scene;
    this.tier = tier;
    this.sprite = scene.matter.add.image(x, y, `bird_tier${tier.replace('x','')}`).setCircle(10).setFrictionAir(0.02).setBounce(0.3);
    this.sprite.setData('type', 'bird');
    this.sprite.setData('tier', tier);
  }
  launch(direction) {
    const power = tierPower[this.tier] || 1;
    this.sprite.setStatic(false);
    this.sprite.applyForce({ x: direction.x * power, y: direction.y * power });
  }
}
