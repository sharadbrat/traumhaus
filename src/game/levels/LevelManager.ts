import { LEVEL_1_DATA } from './level-1';
import { LEVEL_3_DATA } from './level-3';
import { LevelMapData } from '../entities/model';
import { LEVEL_2_DATA } from './level-2';
import { LEVEL_4_DATA } from './level-4';
import { LEVEL_4_MOD_DATA } from './level-4_mod';
import { LEVEL_5_DATA } from './level-5';
import { LEVEL_5_MOD_DATA } from './level-5_mod';
import { LEVEL_6_DATA } from './level-6';
import { LEVEL_7_DATA } from './level-7';
import { LEVEL_8_DATA } from './level-8';
import { LEVEL_9_DATA } from './level-9';

export class LevelManager {

  private static readonly LEVELS = {
    [LEVEL_1_DATA.id]: LEVEL_1_DATA,
    [LEVEL_2_DATA.id]: LEVEL_2_DATA,
    [LEVEL_3_DATA.id]: LEVEL_3_DATA,
    [LEVEL_4_DATA.id]: LEVEL_4_DATA,
    [LEVEL_4_MOD_DATA.id]: LEVEL_4_MOD_DATA,
    [LEVEL_5_DATA.id]: LEVEL_5_DATA,
    [LEVEL_5_MOD_DATA.id]: LEVEL_5_MOD_DATA,
    [LEVEL_6_DATA.id]: LEVEL_6_DATA,
    [LEVEL_7_DATA.id]: LEVEL_7_DATA,
    [LEVEL_8_DATA.id]: LEVEL_8_DATA,
    [LEVEL_9_DATA.id]: LEVEL_9_DATA,
  };

  public static getLevelById(id: string): LevelMapData {
    return LevelManager.LEVELS[id];
  }

  public static getFirstLevel(): LevelMapData {
    return LevelManager.getLevelById(LEVEL_1_DATA.id);
    // return LevelManager.getLevelById(LEVEL_TEST_DATA.id);
  }
}