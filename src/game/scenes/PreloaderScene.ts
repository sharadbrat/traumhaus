import Phaser from 'phaser';
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(SceneIdentifier.PRELOADER_SCENE);
  }

  preload() {
    AssetManager.tiles.forEach(el => this.load.image(el.name, el.file));
    AssetManager.sprites.forEach(el => this.load.spritesheet(el.name, el.file, {
      frameHeight: el.height,
      frameWidth: el.width
    }));
  }

  create() {
    this.scene.run(SceneIdentifier.GAME_SCENE);
  }
}