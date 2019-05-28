import { LevelObject } from './LevelObject';
import { StaticLevelObject } from './StaticLevelObject';
import { GameScene } from '../scenes/GameScene';
import { NPCLevelObject } from './NPCLevelObject';
import { EnemyLevelObject } from './EnemyLevelObject';
import { EnemyLevelObjectData, EnemyLevelObjectType, LevelObjectData, LevelObjectType } from './model';

export class MapObjectFactory {
  public static create(scene: GameScene, data: LevelObjectData): LevelObject {
    if (data.type === LevelObjectType.STATIC) {
      return new StaticLevelObject(scene, data);
    } else if (data.type === LevelObjectType.ENEMY) {
      return new EnemyLevelObject(scene, data as EnemyLevelObjectData);
    } else if (data.type === LevelObjectType.NPC) {
      return new NPCLevelObject(scene, data);
    }
  }
}

// export class EnemyObjectDataFactory {
//   public static get(type: EnemyLevelObjectType): EnemyLevelObjectData {
//     if (type === EnemyLevelObjectType.PATROLING) {
//
//     } else if (type === EnemyLevelObjectType.DASHING) {
//
//     } else if (type === EnemyLevelObjectType.SHOOTING) {
//
//     } else {
//
//     }
//   }
// }
