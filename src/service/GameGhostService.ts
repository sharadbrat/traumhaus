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
    if (value) {
      document.getElementById('hearts').className = "game__hud-hearts game__hud-hearts_enabled";
    } else {
      document.getElementById('hearts').className = "game__hud-hearts";
    }

  }
}
