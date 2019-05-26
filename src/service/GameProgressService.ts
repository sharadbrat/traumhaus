import { Door, LevelMapData } from '../game/entities';
import { LevelManager } from '../game/levels';

export interface GameProgress {
  canBecomeGhost?: boolean;
  currentLevel?: LevelMapData;
}

export class GameProgressService {
  public static GAME_PROGRESS_ID = 'TRAUMHAUS_GAME_PROGRESS';

  private static instance: GameProgressService;

  private gameProgress: GameProgress;

  private lastDoor: Door;

  private constructor() {
    this.gameProgress = {};
  }

  public static getInstance(): GameProgressService {
    if (!GameProgressService.instance) {
      GameProgressService.instance = new GameProgressService();
    }
    return GameProgressService.instance;
  }

  public changeLevel(id: string) {
    this.gameProgress.currentLevel = LevelManager.getLevelById(id);
  }

  public getCurrentLevel(): LevelMapData {
    return this.gameProgress.currentLevel;
  }

  public setCurrentLevel(level: LevelMapData) {
    this.gameProgress.currentLevel = level;
  }

  public getLastDoor(): Door {
    return this.lastDoor;
  }

  public setLastDoor(door: Door) {
    this.lastDoor = door;
  }

  public getProgressFromLocalStorage(): GameProgress {
    let res;

    try {
      res = JSON.parse(localStorage.getItem(GameProgressService.GAME_PROGRESS_ID));
    } catch (e) {
      res = null
    }

    return res;
  }

  public getProgress(): GameProgress {
    return this.gameProgress;
  }

  public clearProgressInLocalStorage() {
    localStorage.removeItem(GameProgressService.GAME_PROGRESS_ID);
  }

  public loadProgress(progress: GameProgress) {
    this.gameProgress = progress;
  }
}