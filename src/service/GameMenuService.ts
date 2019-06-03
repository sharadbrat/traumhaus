export class GameMenuService {
  private static instance: GameMenuService;

  private menuToggleListener: () => void;
  private updateLoadingListener: (val: number) => void;

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

  public setOnUpdateLoadingListener(callback: (val: number) => void) {
    this.updateLoadingListener = (val: number) => callback(val);
  }

  public triggerOnMenuToggle() {
    this.menuToggleListener();
  }

  public updateLoadingProgress(val: number) {
    this.updateLoadingListener(val);
  }
}
