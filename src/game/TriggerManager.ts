import { GameScene } from './scenes/GameScene';
import { LevelObject } from './entities/LevelObject';
import { Player } from './entities';

export type TriggerCallback = (scene: GameScene, object: LevelObject, player: Player) => void;

type TriggerMap = {
  [id:string]: TriggerCallback;
}

export class TriggerManager {
  private static triggerMap: TriggerMap;

  /**
   * Adds trigger to triggerMap.
   * @param id
   * @param callback
   */
  public static add(id: string, callback: TriggerCallback) {
    if (!TriggerManager.triggerMap) {
      TriggerManager.triggerMap = {};
    }

    if (TriggerManager.triggerMap[id]) {
      throw new TypeError(`Can not register trigger with id: ${id}. Trigger is already registered`);
    }

    TriggerManager.triggerMap[id] = callback;
  }

  /**
   * Fires trigger callback from triggerMap
   * @param id
   * @param scene
   * @param object
   * @param player
   */
  public static fire(id: string, scene: GameScene, object: LevelObject, player: Player) {
    if (!TriggerManager.triggerMap || !TriggerManager.triggerMap[id]) {
      throw new TypeError(`Can not fire trigger with id: ${id}. Trigger is not registered`);
    }

    TriggerManager.triggerMap[id](scene, object, player);
  }
}
