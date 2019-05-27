import { CheckedTrigger, LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { LevelObjectData, TriggerEvent } from './model';

export const NPC_TRIGGERS_ACTIONS = {
  ON_IN_NEAR_AREA: 'ON_NPC_IN_NEAR_AREA',
};

export class NPCLevelObject extends LevelObject {

  private npcTriggers: {
    [id: string]: CheckedTrigger,
  };

  constructor(scene: GameScene, options: LevelObjectData) {
    super(scene, options);
    this.sprite.body.immovable = true;

    if (options.meta && options.meta.talkable) {
      this.npcTriggers = {
        inNearArea: {
          event: TriggerEvent.ON_IN_NEAR_AREA,
          action: NPC_TRIGGERS_ACTIONS.ON_IN_NEAR_AREA,
          fixTime: 100,
          lastCheckedOn: 0,
        },
      };
    }
  }

  public update(time: number) {
    super.update(time);

    if (this.isInDifferentWorld()) {
      return;
    }

    if (this.options.meta && this.options.meta.talkable) {
      if (time > this.npcTriggers.inNearArea.fixTime + this.npcTriggers.inNearArea.lastCheckedOn) {
        this.checkInNearAreaTrigger(this.npcTriggers.inNearArea, time);
      }
    }
  }

}
