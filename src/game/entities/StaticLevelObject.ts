import { LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { LevelObjectData } from './model';

export class StaticLevelObject extends LevelObject {
  constructor(scene: GameScene, options: LevelObjectData) {
    super(scene, options);
    this.sprite.body.immovable = true;
  }

}
