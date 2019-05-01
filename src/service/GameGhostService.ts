export class GameGhostService {
  private static instance: GameGhostService;
  private ghostMode: boolean;

  private constructor() {
  }

  public static getInstance(): GameGhostService {
    if (!this.instance) {
      this.instance = new GameGhostService();
    }
    return this.instance;
  }

  public isGhostMode(): boolean {
    return this.ghostMode;
  }

  public setGhostMode(value: boolean) {
    this.ghostMode = value;
  }
}
