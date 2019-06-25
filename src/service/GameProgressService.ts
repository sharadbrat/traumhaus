import { LevelManager } from '../game/levels';
import { Door, LevelMapData } from '../game/entities/model';

export interface GameProgress {
  isNewGame: boolean;
  health: number;
  isVulnerable?: boolean;
  currentLevelId?: string;
  isControllable: boolean;
  lastDoor: Door;
  stage1: {
    gateDialogFinished: boolean;
    doorDialogFinished: boolean;
    benchDialogFinished: boolean;
    benchGhostDialogFinished: boolean;
    isStudentCardRetrieved: boolean;
    isMensaGateOpened: boolean;
  };
  stage2: {
    transformTouched: boolean;
  };
  controls: {
    dash: boolean;
    switch: boolean;
    shoot: boolean;
  };
  showGhostHud: boolean;
}

const DEFAULT_PROGRESS: GameProgress = {
  health: 3,
  isVulnerable: true,
  // isControllable: false,
  isControllable: true,
  isNewGame: false,
  // isNewGame: true,
  lastDoor: null,
  stage1: {
    gateDialogFinished: false,
    doorDialogFinished: false,
    isStudentCardRetrieved: false,
    benchDialogFinished: false,
    benchGhostDialogFinished: false,
    isMensaGateOpened: false
  },
  stage2: {
    transformTouched: false,
  },
  controls: {
    dash: false,
    switch: false,
    shoot: false,
  },
  showGhostHud: false,
  // showGhostHud: true,
};

export class GameProgressService {
  public static GAME_PROGRESS_ID = 'TRAUMHAUS_GAME_PROGRESS';

  private static instance: GameProgressService;

  private gameProgress: GameProgress;

  // private lastDoor: Door;
  private onHealthChange: (health: number) => any;

  decreaseHealthTimeout: number;

  private constructor() {
    this.gameProgress = DEFAULT_PROGRESS;
  }

  public static getInstance(): GameProgressService {
    if (!GameProgressService.instance) {
      GameProgressService.instance = new GameProgressService();
    }
    return GameProgressService.instance;
  }

  public setOnHealthChange(callback: (health: number) => any) {
    this.onHealthChange = callback;
  }

  public changeLevel(id: string) {
    this.gameProgress.currentLevelId = id;
    // this.saveProgressToLocalStorage();
  }

  public getCurrentLevel(): LevelMapData {
    return LevelManager.getLevelById(this.gameProgress.currentLevelId);
  }

  public getLastDoor(): Door {
    return this.gameProgress.lastDoor;
  }

  public setLastDoor(door: Door) {
    this.gameProgress.lastDoor = door;
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
    this.gameProgress.health = 3;
  }

  public setControllable(val: boolean) {
    this.gameProgress.isControllable = val;
  }

  public saveProgressToLocalStorage() {
    localStorage.setItem(GameProgressService.GAME_PROGRESS_ID, JSON.stringify(this.gameProgress));
  }

  public decreaseHealth() {
    if (this.decreaseHealthTimeout) {
      clearTimeout(this.decreaseHealthTimeout);
    }

    if (--this.getProgress().health !== 0) {
      this.recoverHealthTimer();
    }

    this.onHealthChange(this.getProgress().health);
  }

  public recoverHealthTimer() {
    this.decreaseHealthTimeout = window.setTimeout(() => {
      this.onHealthChange(++this.getProgress().health);
      if (this.getProgress().health < 3) {
        this.recoverHealthTimer();
      }
    }, 10000);
  }

  reset() {
    this.gameProgress = DEFAULT_PROGRESS;
    clearTimeout(this.decreaseHealthTimeout);
    this.onHealthChange = null;
  }
}
