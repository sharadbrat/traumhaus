import Phaser from 'phaser';

import { GameScene } from './GameScene';
import { PreloaderScene } from './PreloaderScene';

export enum SceneIdentifier {
  GAME_SCENE = 'GAME_SCENE',
  PRELOADER_SCENE = 'PRELOADER_SCENE',
}

export interface SceneObject {
  key: string;
  scene: typeof Phaser.Scene;
}

export class SceneManager {

  public static getScenes(): SceneObject[] {
    return [
      {
        key: SceneIdentifier.GAME_SCENE,
        scene: GameScene,
      },
      {
        key: SceneIdentifier.PRELOADER_SCENE,
        scene: PreloaderScene,
      },
    ];
  }
}
