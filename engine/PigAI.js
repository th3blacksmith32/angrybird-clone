export default class PigAI {
  constructor(scene, pig) {
    this.scene = scene;
    this.pig = pig;
    this.state = 'Idle';
    this.patrolDirection = 1;
  }
  update(birds) {
    const sprite = this.pig.sprite;
    const closestBird = birds.filter(b => b.active).sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, sprite.x, sprite.y) - Phaser.Math.Distance.Between(b.x, b.y, sprite.x, sprite.y))[0];
    if (closestBird) {
      const distance = Phaser.Math.Distance.Between(closestBird.x, closestBird.y, sprite.x, sprite.y);
      if (distance < 200) this.state = 'Alert';
      if (distance < 120) this.state = 'Evade';
    }
    switch (this.state) {
      case 'Idle':
        this.patrol(sprite, 0.3);
        break;
      case 'Alert':
        this.patrol(sprite, 0.8);
        break;
      case 'Evade':
        this.evade(sprite, closestBird);
        break;
      default:
        this.patrol(sprite, 0.3);
    }
  }
  patrol(sprite, speed) {
    sprite.setVelocityX(this.patrolDirection * speed);
    if (sprite.x > 750 || sprite.x < 550) this.patrolDirection *= -1;
  }
  evade(sprite, target) {
    if (!target) return this.patrol(sprite, 0.4);
    const dir = sprite.x < target.x ? -1 : 1;
    sprite.setVelocityX(dir * 2);
  }
}
