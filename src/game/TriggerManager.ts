import { GameScene } from './scenes/GameScene';
import { LevelObject, Player } from './entities';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../service';
import { DialogManager } from './dialogs';
import { GameManager } from './GameManager';
import { AssetManager } from './assets';
import { SceneManager } from './scenes/SceneManager';
import { LevelManager } from './levels';

export type TriggerCallback = (content: TriggerContents) => void;

type TriggerMap = {
  [id:string]: TriggerCallback;
}

export interface TriggerContents {
  scene: GameScene;
  object?: LevelObject;
  player: Player;
  services: {
    progress: GameProgressService,
    ghost: GameGhostService,
    sound: GameSoundService,
    menu: GameMenuService,
  },
  managers: {
    dialog: typeof DialogManager,
    trigger: typeof TriggerManager,
    game: typeof GameManager,
    asset: typeof AssetManager,
    scene: typeof SceneManager,
    level: typeof LevelManager,
  }
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
   * @param content
   */
  public static fire(id: string, content: TriggerContents) {
    if (!TriggerManager.triggerMap || !TriggerManager.triggerMap[id]) {
      throw new TypeError(`Can not fire trigger with id: ${id}. Trigger is not registered`);
    }

    TriggerManager.triggerMap[id](content);
  }

  /**
   * Removes all the registered triggers from triggerMap
   */
  public static clear() {
    if (TriggerManager.triggerMap) {
      Object.keys(TriggerManager.triggerMap).forEach(key => delete TriggerManager.triggerMap[key]);
    }
  }
}
