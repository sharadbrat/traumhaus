import { LevelManager } from '../game/levels';
import { Door, LevelMapData } from '../game/entities/model';

export interface GameProgress {
  isVulnerable?: boolean;
  canBecomeGhost?: boolean;
  currentLevel?: LevelMapData;
  isControllable: boolean;
}

export class GameProgressService {
  public static GAME_PROGRESS_ID = 'TRAUMHAUS_GAME_PROGRESS';

  private static instance: GameProgressService;

  private gameProgress: GameProgress;

  private lastDoor: Door;

  private constructor() {
    this.gameProgress = {
      isVulnerable: true,
      isControllable: false,
      // debugging purposes only
      canBecomeGhost: true,
    };
  }

  public static getInstance(): GameProgressService {
    if (!GameProgressService.instance) {
      GameProgressService.instance = new GameProgressService();
    }
    return GameProgressService.instance;
  }

  public changeLevel(id: string) {
    this.gameProgress.currentLevel = LevelManager.getLevelById(id);
    // this.saveProgressToLocalStorage();
  }

  public getCurrentLevel(): LevelMapData {
    return this.gameProgress.currentLevel;
  }

  public setCurrentLevel(level: LevelMapData) {
    this.gameProgress.currentLevel = level;
    // this.saveProgressToLocalStorage();
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

  public setControllable(val: boolean) {
    this.gameProgress.isControllable = val;
  }

  private saveProgressToLocalStorage() {
    // todo: add position save
    localStorage.setItem(GameProgressService.GAME_PROGRESS_ID, JSON.stringify(this.gameProgress));
  }
}