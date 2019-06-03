import { LEVEL_1_DATA } from './level-1';
import { LEVEL_3_DATA } from './level-3';
import { LEVEL_TEST_DATA } from './level-test';
import { LevelMapData } from '../entities/model';
import { LEVEL_2_DATA } from './level-2';

export class LevelManager {

  private static readonly LEVELS = {
    [LEVEL_1_DATA.id]: LEVEL_1_DATA,
    [LEVEL_2_DATA.id]: LEVEL_2_DATA,
    [LEVEL_3_DATA.id]: LEVEL_3_DATA,
    [LEVEL_TEST_DATA.id]: LEVEL_TEST_DATA,
  };

  public static getLevelById(id: string): LevelMapData {
    return LevelManager.LEVELS[id];
  }

  public static getFirstLevel(): LevelMapData {
    return LevelManager.getLevelById(LEVEL_1_DATA.id);
    // return LevelManager.getLevelById(LEVEL_TEST_DATA.id);
  }
}