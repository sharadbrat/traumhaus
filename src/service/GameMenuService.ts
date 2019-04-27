export class GameMenuService {
  private static instance: GameMenuService;

  private menuToggleListener: () => void;

  private constructor() {
  }

  public static getInstance(): GameMenuService {
    if (!this.instance) {
      this.instance = new GameMenuService();
    }
    return this.instance
  }

  public setOnMenuToggleListener(callback: () => void) {
    this.menuToggleListener = () => callback();
  }

  public triggerOnMenuToggle() {
    this.menuToggleListener();
  }
}
