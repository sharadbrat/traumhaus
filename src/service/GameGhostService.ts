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
  }
}
