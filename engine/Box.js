export default class Box {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.matter.add.image(x, y, 'box', undefined, { chamfer: { radius: 2 } }).setRectangle(30, 30).setStatic(false);
    this.sprite.setData('type', 'box');
    this.sprite.setData('hp', 50);
  }
  damage(amount) {
    const hp = this.sprite.getData('hp') - amount;
    this.sprite.setData('hp', hp);
    if (hp <= 0) {
      this.sprite.destroy();
      return true;
    }
    return false;
  }
}
