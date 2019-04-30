import Phaser from 'phaser';
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(SceneIdentifier.PRELOADER_SCENE);
  }

  preload() {
    AssetManager.loadAssets(this);
  }

  create() {
    this.scene.run(SceneIdentifier.GAME_SCENE);
  }
}