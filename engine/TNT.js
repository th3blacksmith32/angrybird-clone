export default class TNT {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.matter.add.image(x, y, 'tnt').setRectangle(28, 28).setStatic(false);
    this.sprite.setData('type', 'tnt');
    this.sprite.setData('hp', 40);
  }
  explode() {
    const bodies = this.scene.matter.world.localWorld.bodies;
    bodies.forEach(body => {
      const sprite = body.gameObject;
      if (!sprite) return;
      const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.sprite.x, this.sprite.y);
      if (dist < 200) {
        const force = (200 - dist) / 2000;
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, sprite.x, sprite.y);
        this.scene.matter.body.applyForce(body, { x: body.position.x, y: body.position.y }, { x: Math.cos(angle) * force, y: Math.sin(angle) * force });
        if (sprite.getData('type') === 'pig') sprite.setData('hp', (sprite.getData('hp') || 0) - 80);
        if (sprite.getData('type') === 'box') sprite.setData('hp', (sprite.getData('hp') || 0) - 50);
      }
    });
    this.sprite.destroy();
  }
  damage(amount) {
    const hp = this.sprite.getData('hp') - amount;
    this.sprite.setData('hp', hp);
    if (hp <= 0) this.explode();
  }
}
