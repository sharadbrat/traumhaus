import { CheckedTrigger, LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { LevelObjectData, TriggerEvent } from './model';
import { NPC_TRIGGERS_ACTIONS } from './NPCLevelObject';

export class StaticLevelObject extends LevelObject {
  trigger: CheckedTrigger;

  constructor(scene: GameScene, options: LevelObjectData) {
    super(scene, options);
    this.sprite.body.immovable = true;

    if (options.meta && options.meta.talkable) {
      this.trigger = {
        event: TriggerEvent.ON_IN_NEAR_AREA,
        action: NPC_TRIGGERS_ACTIONS.ON_IN_NEAR_AREA,
        fixTime: 100,
        lastCheckedOn: 0,
      };
    }
  }

  public update(time: number) {
    super.update(time);

    if (this.isInDifferentWorld()) {
      return;
    }

    if (this.options.meta && this.options.meta.talkable) {
      if (time > this.trigger.fixTime + this.trigger.lastCheckedOn) {
        this.checkInNearAreaTrigger(this.trigger, time);
      }
    }
  }

}
