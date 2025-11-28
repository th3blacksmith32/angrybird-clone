import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';
import { assetData } from '../engine/assetData.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }
  preload() {
    Object.entries(assetData).forEach(([key, uri]) => {
      this.load.image(key, uri);
    });
  }
  create() {
    this.scene.start('MenuScene');
  }
}
