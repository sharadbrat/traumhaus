import Phaser from 'phaser';

import { AssetManager } from '../assets';
import { SceneIdentifier } from './SceneManager';
import { GameMenuService } from '../../service';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(SceneIdentifier.PRELOADER_SCENE);
  }

  preload() {
    AssetManager.loadAssets(this);
    this.load.on('progress', (value: number) => {
      GameMenuService.getInstance().updateLoadingProgress(value);
    });

    this.load.on('complete', () => {
      GameMenuService.getInstance().updateLoadingProgress(1);
    });
  }

  create() {
    this.scene.run(SceneIdentifier.GAME_SCENE);
  }
}
