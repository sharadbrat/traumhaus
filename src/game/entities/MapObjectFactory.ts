import { LevelObjectData, LevelObjectType } from './LevelMap';
import { LevelObject } from './LevelObject';
import { StaticLevelObject } from './StaticLevelObject';
import { GameScene } from '../scenes/GameScene';

export class MapObjectFactory {
  public static create(scene: GameScene, data: LevelObjectData): LevelObject {
    if (data.type === LevelObjectType.STATIC) {
      return new StaticLevelObject(scene, data);
    } else if (data.type === LevelObjectType.ENEMY) {
      throw new Error('Not implemented!');
      return new StaticLevelObject(scene, data);
    } else if (data.type === LevelObjectType.NPC) {
      return new StaticLevelObject(scene, data);
    }
  }
}