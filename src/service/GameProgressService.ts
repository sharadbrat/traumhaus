import { LevelManager } from '../game/levels';
import { Door, LevelMapData } from '../game/entities/model';

export interface GameProgress {
  health: number;
  isVulnerable?: boolean;
  canBecomeGhost?: boolean;
  currentLevel?: LevelMapData;
  isControllable: boolean;
  stage1: {
    gateDialogFinished: boolean;
    doorDialogFinished: boolean;
    benchDialogFinished: boolean;
    benchGhostDialogFinished: boolean;
    isStudentCardRetrieved: boolean;
    isMensaGateOpened: boolean;
  };
  controls: {
    dash: boolean;
    switch: boolean;
    shoot: boolean;
  };
  showGhostHud: boolean;
}

export class GameProgressService {
  public static GAME_PROGRESS_ID = 'TRAUMHAUS_GAME_PROGRESS';

  private static instance: GameProgressService;

  private gameProgress: GameProgress;

  private lastDoor: Door;

  private constructor() {
    this.gameProgress = {
      health: 3,
      isVulnerable: true,
      isControllable: false,
      // canBecomeGhost: true,
      stage1: {
        gateDialogFinished: false,
        doorDialogFinished: false,
        isStudentCardRetrieved: false,
        benchDialogFinished: false,
        benchGhostDialogFinished: false,
        isMensaGateOpened: false
      },
      controls: {
        dash: false,
        switch: false,
        shoot: false,
      },
      showGhostHud: false,
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

  public decreaseHealth() {
    const health = --this.getProgress().health;
    if (health === 3) {
      document.getElementById('health-1').className = 'game__hud-heart';
      document.getElementById('health-2').className = 'game__hud-heart';
      document.getElementById('health-3').className = 'game__hud-heart';
    } else if (health === 2) {
      document.getElementById('health-1').className = 'game__hud-heart';
      document.getElementById('health-2').className = 'game__hud-heart';
      document.getElementById('health-3').className = 'game__hud-heart game__hud-heart_damaged';
    } else if (health === 1) {
      document.getElementById('health-1').className = 'game__hud-heart';
      document.getElementById('health-2').className = 'game__hud-heart game__hud-heart_damaged';
      document.getElementById('health-3').className = 'game__hud-heart game__hud-heart_damaged';
    } else {
      document.getElementById('health-1').className = 'game__hud-heart game__hud-heart_damaged';
      document.getElementById('health-2').className = 'game__hud-heart game__hud-heart_damaged';
      document.getElementById('health-3').className = 'game__hud-heart game__hud-heart_damaged';
    }

    if (health === 0) {
      console.log('lost the game');
    }
  }
}