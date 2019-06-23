export class GameGhostService {
  private static instance: GameGhostService;
  private ghostMode: boolean;
  private onGhostHud: (isGhost: boolean) => any;

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

  public setOnGhostHud(callback: (isGhost: boolean) => any) {
    this.onGhostHud = callback;
  }

  public setGhostMode(value: boolean) {
    this.ghostMode = value;
    this.onGhostHud(value);
  }

  reset() {
    this.onGhostHud = null;
    this.ghostMode = null;
  }
}
