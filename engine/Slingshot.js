import Bird from './Bird.js';

export default class Slingshot {
  constructor(scene, x, y, birdsQueue) {
    this.scene = scene;
    this.position = { x, y };
    this.birdsQueue = birdsQueue;
    this.currentBird = null;
    this.rubberLeft = scene.add.image(x - 10, y, 'rope');
    this.rubberRight = scene.add.image(x + 10, y, 'rope');
    this.slingshot = scene.add.image(x, y + 20, 'slingshot');
    this.loadNextBird();
  }
  loadNextBird() {
    const tier = this.birdsQueue.shift();
    if (!tier) return;
    this.currentBird = new Bird(this.scene, tier, this.position.x, this.position.y);
    this.currentBird.sprite.setStatic(true);
    this.attachInput();
    this.scene.events.emit('birdQueued', this.birdsQueue.length, tier);
  }
  attachInput() {
    const bird = this.currentBird.sprite;
    bird.setInteractive();
    bird.on('pointerdown', () => {
      this.scene.input.on('pointermove', pointer => {
        bird.setPosition(pointer.x, pointer.y);
        this.updateRubber(pointer.x, pointer.y);
      });
    });
    this.scene.input.on('pointerup', pointer => {
      if (!this.currentBird) return;
      this.scene.input.off('pointermove');
      const dir = { x: (this.position.x - pointer.x) / 1500, y: (this.position.y - pointer.y) / 1500 };
      this.currentBird.launch(dir);
      this.updateRubber(this.position.x, this.position.y);
      this.currentBird = null;
      this.scene.time.delayedCall(800, () => this.loadNextBird());
    });
  }
  updateRubber(x, y) {
    this.rubberLeft.setScale(1, Phaser.Math.Clamp(Phaser.Math.Distance.Between(x, y, this.position.x, this.position.y) / 30, 1, 3));
    this.rubberRight.setScale(1, Phaser.Math.Clamp(Phaser.Math.Distance.Between(x, y, this.position.x, this.position.y) / 30, 1, 3));
  }
}
