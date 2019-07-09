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
    shootingTouched: boolean;
    leverTouched: boolean;
  };
  stage3: {
    book1: boolean;
    book2: boolean;
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
  isControllable: false,
  isNewGame: true,
  // isControllable: true,
  // isNewGame: false,
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
    shootingTouched: false,
    leverTouched: false,
  },
  stage3: {
    book1: false,
    book2: false,
  },
  controls: {
    dash: false,
    switch: false,
    shoot: false,
    // dash: true,
    // switch: true,
    // shoot: true,
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
  private onDashCooldownChange: (health: boolean) => any;
  private onShootCooldownChange: (health: boolean) => any;
  private onTransformCooldownChange: (health: boolean) => any;

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
    this.onHealthChange(this.getProgress().health);
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
    if (progress) {
      this.gameProgress = progress;
    } else {
      this.gameProgress = DEFAULT_PROGRESS;
    }
    this.gameProgress.health = 3;
    if (this.onHealthChange) {
      this.onHealthChange(3);
    }
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
  }

  setOnDashCooldownChange(onDashChange: (val: boolean) => void) {
    this.onDashCooldownChange = onDashChange;
  }

  setOnShootCooldownChange(onShootChange: (val: boolean) => void) {
    this.onShootCooldownChange = onShootChange;
  }

  setOnTransformCooldownChange(onTransformChange: (val: boolean) => void) {
    this.onTransformCooldownChange = onTransformChange;
  }

  setDashCooldown(time: number) {
    this.onDashCooldownChange(true);
    setTimeout(() => this.onDashCooldownChange(false), time);
  }

  setShootCooldown(time: number) {
    this.onShootCooldownChange(true);
    setTimeout(() => this.onShootCooldownChange(false), time);
  }

  setTransformCooldown(time: number) {
    this.onTransformCooldownChange(true);
    setTimeout(() => this.onTransformCooldownChange(false), time);
  }
}
