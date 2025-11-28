import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';
import PigAI from './PigAI.js';

export default class Pig {
  constructor(scene, x, y, hp = 100, ai = true) {
    this.scene = scene;
    this.hp = hp;
    this.sprite = scene.matter.add.image(x, y, 'pig').setCircle(12).setBounce(0.1).setFrictionAir(0.02);
    this.sprite.setData('type', 'pig');
    this.sprite.setData('hp', hp);
    this.ai = ai ? new PigAI(scene, this) : null;
  }
  damage(amount) {
    this.hp -= amount;
    this.sprite.setData('hp', this.hp);
    if (this.hp <= 0) {
      this.sprite.destroy();
      return true;
    }
    return false;
  }
  update(targetBirds) {
    if (this.ai) this.ai.update(targetBirds);
  }
}
