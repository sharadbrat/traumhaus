import Phaser from 'phaser';
import { AssetManager } from '../AssetManager';
import { Player } from './Player';
import { GameScene } from '../scenes/GameScene';
import { GameGhostService } from '../../service/GameGhostService';

export type CollisionDetector = 0 | 1;

export interface MapPosition {
  x: number;
  y: number;
}

export interface Door {
  fromPosition: MapPosition;
  toPosition: MapPosition;
  toId: string;
}

export interface LightSource {
  id: string,
  radius: number;
  rolloff: number;
  position: MapPosition;
}

export interface LightSettings {
  playerLightRadius: number;
  playerLightRolloff: number;
  fogAlpha: number;
  sources?: LightSource[];
  fogColor?: number;
}

export interface World {
  collisionMap: CollisionDetector[][];
  tileMap: number[][];
  tileMapId: string;
  doors?: Door[];
  lightSettings: LightSettings;
}

export interface LevelMapData {
  id: string;
  width: number;
  height: number;
  realWorld?: World;
  ghostWorld?: World;
  startPosition?: MapPosition;
}

export interface LevelMapConstructorOptions {
  data: LevelMapData;
  scene: GameScene;
}

export class LevelMap {
  static readonly REAL_GRAPHIC_LAYER_ID = 'REAL_GRAPHIC';
  static readonly REAL_COLLISION_LAYER_ID = 'REAL_COLLISION';

  static readonly GHOST_GRAPHIC_LAYER_ID = 'GHOST_GRAPHIC';
  static readonly GHOST_COLLISION_LAYER_ID = 'GHOST_COLLISION';

  static readonly LIGHT_LAYER_ID = 'LIGHT';

  private tilemap: Phaser.Tilemaps.Tilemap;
  private mapData: LevelMapData;
  private utilTiles: Phaser.Tilemaps.Tileset;

  private realWorldTiles: Phaser.Tilemaps.Tileset;
  private realGraphicLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private realCollisionLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private ghostWorldTiles: Phaser.Tilemaps.Tileset;
  private ghostGraphicLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private ghostCollisionLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private ghostService: GameGhostService;

  constructor(options: LevelMapConstructorOptions) {
    this.mapData = options.data;
    this.ghostService = GameGhostService.getInstance();

    this.tilemap = this.createTilemap(options.scene, options.data.width, options.data.height);

    this.utilTiles = this.tilemap.addTilesetImage(AssetManager.util.name);

    if (options.data.realWorld) {
      this.realWorldTiles = this.tilemap.addTilesetImage(options.data.realWorld.tileMapId);
      this.realGraphicLayer = this.createGraphicLayer(LevelMap.REAL_GRAPHIC_LAYER_ID, options.data.realWorld.tileMap);
      this.realCollisionLayer = this.createCollisionLayer(LevelMap.REAL_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.realWorld.collisionMap);
    }

    if (options.data.ghostWorld) {

      this.ghostWorldTiles = this.tilemap.addTilesetImage(options.data.ghostWorld.tileMapId);
      this.ghostGraphicLayer = this.createGraphicLayer(LevelMap.GHOST_GRAPHIC_LAYER_ID, options.data.ghostWorld.tileMap);
      this.ghostCollisionLayer = this.createCollisionLayer(LevelMap.GHOST_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.ghostWorld.collisionMap);

      if (this.ghostService.isGhostMode()) {
        this.ghostGraphicLayer.setAlpha(1);
      } else {
        this.ghostGraphicLayer.setAlpha(0);
      }
    }
  }

  getTilemap(): Phaser.Tilemaps.Tilemap {
    return this.tilemap;
  }

  getCollisionLayer(): Phaser.Tilemaps.StaticTilemapLayer {
    if (this.ghostService.isGhostMode() && this.ghostCollisionLayer) {
      return this.ghostCollisionLayer;
    } else {
      return this.realCollisionLayer;
    }
  }

  getWidth(): number {
    return this.mapData.width;
  }

  getHeight(): number {
    return this.mapData.height;
  }

  getMapData(): LevelMapData {
    return this.mapData;
  }

  checkPlayerDoorCollision(body: Phaser.Physics.Arcade.Body): Door | null {
    const x = body.position.x;
    const y = body.position.y;

    if (this.ghostService.isGhostMode()) {
      if (this.mapData.ghostWorld.doors) {
        for (let door of this.mapData.ghostWorld.doors) {
          if (this.tilemap.worldToTileX(x) === door.fromPosition.x && this.tilemap.worldToTileY(y) === door.fromPosition.y) {
            return door;
          }
        }
      }
    } else {
      for (let door of this.mapData.realWorld.doors) {
        if (this.tilemap.worldToTileX(x) === door.fromPosition.x && this.tilemap.worldToTileY(y) === door.fromPosition.y) {
          return door;
        }
      }
    }
  }

  setGhostMode(isGhost: boolean) {
    if (this.ghostGraphicLayer) {
      this.ghostGraphicLayer.setAlpha(isGhost ? 1 : 0);
    }
  }

  private createTilemap(scene: Phaser.Scene, width: number, height: number): Phaser.Tilemaps.Tilemap {
    return scene.make.tilemap({
      tileWidth: AssetManager.environment.width,
      tileHeight: AssetManager.environment.height,
      width: width,
      height: height,
    });
  }

  private createGraphicLayer(layerId: string, tileMap: number[][]) {
    const graphicLayer = this.tilemap.createBlankDynamicLayer(layerId, AssetManager.environment.name, 0, 0);

    graphicLayer.putTilesAt(tileMap, 0, 0);
    graphicLayer.setAlpha(1);

    return this.tilemap.convertLayerToStatic(graphicLayer);
  }

  private createCollisionLayer(layerId: string, width: number, height: number, collisionMap: CollisionDetector[][]): Phaser.Tilemaps.StaticTilemapLayer {
    const collisionLayer = this.tilemap.createBlankDynamicLayer(layerId, this.utilTiles, 0, 0);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (collisionMap[y][x] === 1) {
          collisionLayer.putTileAt(AssetManager.util.indices.transparent, x, y);
        }
      }
    }
    collisionLayer.setCollisionBetween(0, 256);
    return this.tilemap.convertLayerToStatic(collisionLayer);
  }
}