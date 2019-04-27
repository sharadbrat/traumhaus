import { Door, LevelMapData } from '../game/entities/LevelMap';
import { LevelManager } from '../game/levels';

export class GameDataService {
  private static instance: GameDataService;

  private gameData: any;
  private savedLevels: {
    [id:string]: LevelMapData;
  };

  private currentLevel: LevelMapData;
  private lastDoor: Door;

  private constructor() {
    this.savedLevels = {};
  }

  public static getInstance(): GameDataService {
    if (!GameDataService.instance) {
      GameDataService.instance = new GameDataService();
    }
    return GameDataService.instance;
  }

  // todo: add impl
  public getGameData() {
    return this.gameData;
  }

  public loadGameData() {
    this.gameData = {};
  }

  public changeLevel(id: string) {
    this.saveLevel(this.currentLevel);
    if (this.savedLevels[id]) {
      this.currentLevel = this.savedLevels[id];
    } else {
      this.currentLevel = LevelManager.getLevelById(id);
    }
  }

  public getCurrentLevel(): LevelMapData {
    return this.currentLevel;
  }

  public setCurrentLevel(level: LevelMapData) {
    this.currentLevel = level;
  }

  public getLastDoor(): Door {
    return this.lastDoor;
  }

  public setLastDoor(door: Door) {
    this.lastDoor = door;
  }

  private saveLevel(level: LevelMapData) {
    this.savedLevels[level.id] = level;
  }
}