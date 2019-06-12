import { GameProgressService } from './GameProgressService';

export class GameGhostService {
  private static instance: GameGhostService;
  private ghostMode: boolean;

  private constructor() {
  }

  public static getInstance(): GameGhostService {
    if (!GameGhostService.instance) {
      GameGhostService.instance = new GameGhostService();
    }
    return GameGhostService.instance;
  }

  public isGhostMode(): boolean {
    return this.ghostMode;
  }

  public setGhostMode(value: boolean) {
    this.ghostMode = value;
    // todo: fix the issue with react. when I show the dialog, react recalculates the HUD and makes it shown
    if (value && GameProgressService.getInstance().getProgress().showGhostHud) {
      document.getElementById('hearts').className = "game__hud-hearts game__hud-hearts_enabled";
    } else {
      document.getElementById('hearts').className = "game__hud-hearts";
    }

  }
}
