import { LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { LevelObjectData } from './LevelMap';

export class StaticLevelObject extends LevelObject {
  constructor(scene: GameScene, options: LevelObjectData) {
    super(scene, options);
    this.sprite.body.immovable = true;
  }

}