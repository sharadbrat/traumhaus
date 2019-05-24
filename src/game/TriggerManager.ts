import { GameScene } from './scenes/GameScene';
import { LevelObject, Player } from './entities';

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
      console.log(`Trigger with id: ${id} is already registered. Registering new callback for it.`)
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
