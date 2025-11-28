import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelScene from './scenes/LevelScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight * 0.7,
  parent: 'game-container',
  backgroundColor: '#87ceeb',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 }, debug: false }
  },
  scene: [BootScene, PreloadScene, MenuScene, LevelScene, UIScene]
};

const game = new Phaser.Game(config);

window.gameInstance = game;
