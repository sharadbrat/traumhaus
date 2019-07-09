import { LevelObjectData, LevelObjectType, TriggerEvent } from '../entities/model';
import { AssetManager } from '../assets';

export function getBook(id: string, x: number, y: number, action: string): LevelObjectData {
  return {
    id: id,
    type: LevelObjectType.STATIC,
    isCollideable: false,
    width: 16,
    height: 16,
    position: {x: x, y: y, offsetY: 5, offsetX: -3},
    graphics: {
      asset: AssetManager.spriteAssets.book,
      offsetX: 0,
      offsetY: 0,
    },
    triggers: [
      {
        event: TriggerEvent.ON_IN_AREA,
        action: action,
        fixTime: 1000,
      },
    ],
    inGhostWorld: false,
    meta: {
      talkable: false,
    },
  };
}