export class GameMenuService {
  private static instance: GameMenuService;

  private menuToggleListener: () => void;

  private constructor() {
  }

  public static getInstance(): GameMenuService {
    if (!GameMenuService.instance) {
      GameMenuService.instance = new GameMenuService();
    }
    return GameMenuService.instance
  }

  public setOnMenuToggleListener(callback: () => void) {
    this.menuToggleListener = () => callback();
  }

  public triggerOnMenuToggle() {
    this.menuToggleListener();
  }
}
