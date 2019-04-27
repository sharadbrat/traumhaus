import Phaser from 'phaser';
import { PreloaderScene } from './PreloaderScene';
import ReferenceScene from './ReferenceScene';
import InfoScene from './InfoScene';
import { GameScene } from './GameScene';

export enum SceneIdentifier {
  GAME_SCENE = 'GAME_SCENE',
  TITLES_SCENE = 'TITLES_SCENE',
  PRELOADER_SCENE = 'PRELOADER_SCENE',
  DUNGEON_SCENE = 'DUNGEON',
  INFO_SCENE = 'INFO',
  REFERENCE_SCENE = 'REFERENCE',
}

export interface SceneObject {
  key: string;
  scene: typeof Phaser.Scene;
}

export class SceneManager {

  public static getScenes(): SceneObject[] {
    return [
      {
        key: SceneIdentifier.PRELOADER_SCENE,
        scene: PreloaderScene,
      },
      {
        key: SceneIdentifier.REFERENCE_SCENE,
        scene: ReferenceScene,
      },
      {
        key: SceneIdentifier.INFO_SCENE,
        scene: InfoScene,
      },
      {
        key: SceneIdentifier.GAME_SCENE,
        scene: GameScene,
      }
    ];
  }
}
