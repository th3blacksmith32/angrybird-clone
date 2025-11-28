import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';
import LevelLoader from '../engine/LevelLoader.js';
import Slingshot from '../engine/Slingshot.js';
import Pig from '../engine/Pig.js';
import Box from '../engine/Box.js';
import TNT from '../engine/TNT.js';
import PhysicsValidator from '../engine/PhysicsValidator.js';

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
    this.score = 0;
  }
  init(data) {
    this.levelKey = data.levelKey || 'level1';
  }
  create() {
    this.score = 0;
    this.events.emit('scoreUpdate', this.score);
    this.loader = new LevelLoader(this);
    const level = this.loader.loadLevel(this.levelKey);
    this.add.image(400, 550, 'ground').setScale(80, 2);
    this.matter.add.rectangle(400, 570, 800, 40, { isStatic: true });
    this.pigs = level.pigs.map(p => new Pig(this, p.x, p.y, p.hp || 100, p.ai !== false));
    this.boxes = level.boxes.map(b => new Box(this, b.x, b.y));
    this.tnts = level.tnt.map(t => new TNT(this, t.x, t.y));
    this.slingshot = new Slingshot(this, 150, 450, [...level.birds]);
    this.cameras.main.setBounds(0, 0, 1200, 600);
    this.cameras.main.startFollow(this.slingshot.slingshot, false, 0.05, 0.05, -200, 0);
    this.registerCollisions();
    this.scene.launch('UIScene', { score: this.score, birds: level.birds });
  }
  registerCollisions() {
    this.matter.world.on('collisionstart', event => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const a = bodyA.gameObject;
        const b = bodyB.gameObject;
        if (!a || !b) return;
        const speed = pair.collision.velocity;
        if (a.getData('type') === 'bird' && b.getData('type') === 'pig') this.hitPig(b, speed);
        if (a.getData('type') === 'pig' && b.getData('type') === 'bird') this.hitPig(a, speed);
        if (a.getData('type') === 'bird' && b.getData('type') === 'box') this.hitBox(b, speed);
        if (a.getData('type') === 'box' && b.getData('type') === 'bird') this.hitBox(a, speed);
        if (a.getData('type') === 'bird' && b.getData('type') === 'tnt') this.hitTnt(b, speed);
        if (a.getData('type') === 'tnt' && b.getData('type') === 'bird') this.hitTnt(a, speed);
      });
    });
  }
  hitPig(pigSprite, speed) {
    const pigObj = this.pigs.find(p => p.sprite === pigSprite);
    if (!pigObj) return;
    const dead = pigObj.damage(speed * 30);
    if (dead) {
      this.score += 100;
      this.events.emit('scoreUpdate', this.score);
    }
  }
  hitBox(boxSprite, speed) {
    const boxObj = this.boxes.find(b => b.sprite === boxSprite);
    if (!boxObj) return;
    const destroyed = boxObj.damage(speed * 20);
    if (destroyed) {
      this.score += 50;
      this.events.emit('scoreUpdate', this.score);
    }
  }
  hitTnt(tntSprite, speed) {
    const tntObj = this.tnts.find(t => t.sprite === tntSprite);
    if (!tntObj) return;
    tntObj.damage(speed * 20);
    this.score += 300;
    this.events.emit('scoreUpdate', this.score);
  }
  update() {
    const birds = this.matter.world.localWorld.bodies.map(b => b.gameObject).filter(Boolean).filter(obj => obj.getData('type') === 'bird');
    this.pigs.forEach(p => p.update(birds));
  }
}
