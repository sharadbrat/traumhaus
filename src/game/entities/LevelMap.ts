import Phaser from 'phaser';
import { AssetManager } from '../AssetManager';
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

export interface GraphicLayer {
  tileMapId: string;
  tileMap: number[][];
}

export interface World {
  collisionMap: CollisionDetector[][];
  backgroundGraphicLayers: GraphicLayer[];
  foregroundGraphicLayers?: GraphicLayer[];
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
  static readonly REAL_BACKGROUND_GRAPHIC_LAYER_ID = 'REAL_BACKGROUND_GRAPHIC';
  static readonly REAL_FOREGROUND_GRAPHIC_LAYER_ID = 'REAL_FOREGROUND_GRAPHIC';
  static readonly REAL_COLLISION_LAYER_ID = 'REAL_COLLISION';

  static readonly GHOST_BACKGROUND_GRAPHIC_LAYER_ID = 'GHOST_BACKGROUND_GRAPHIC';
  static readonly GHOST_FOREGROUND_GRAPHIC_LAYER_ID = 'GHOST_FOREGROUND_GRAPHIC';
  static readonly GHOST_COLLISION_LAYER_ID = 'GHOST_COLLISION';

  static readonly LIGHT_LAYER_ID = 'LIGHT';

  private tilemap: Phaser.Tilemaps.Tilemap;
  private mapData: LevelMapData;
  private utilTiles: Phaser.Tilemaps.Tileset;

  private realWorldTiles: Phaser.Tilemaps.Tileset[];
  private realBackgroundGraphicLayers: Phaser.Tilemaps.StaticTilemapLayer[];
  private realForegroundGraphicLayers: Phaser.Tilemaps.StaticTilemapLayer[];
  private realCollisionLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private ghostWorldTiles: Phaser.Tilemaps.Tileset[];
  private ghostBackgroundGraphicLayers: Phaser.Tilemaps.StaticTilemapLayer[];
  private ghostForegroundGraphicLayers: Phaser.Tilemaps.StaticTilemapLayer[];
  private ghostCollisionLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private ghostService: GameGhostService;

  constructor(options: LevelMapConstructorOptions) {
    this.mapData = options.data;
    this.ghostService = GameGhostService.getInstance();

    this.tilemap = this.createTilemap(options.scene, options.data.width, options.data.height);

    this.utilTiles = this.tilemap.addTilesetImage(AssetManager.util.name);

    if (options.data.realWorld) {
      this.realBackgroundGraphicLayers = [];
      this.realWorldTiles = [];

      for (let i = 0; i < options.data.realWorld.backgroundGraphicLayers.length; i++) {
        const layer = options.data.realWorld.backgroundGraphicLayers[i];
        this.realWorldTiles.push(this.tilemap.addTilesetImage(layer.tileMapId));
        this.realBackgroundGraphicLayers.push(this.createGraphicLayer(`${LevelMap.REAL_BACKGROUND_GRAPHIC_LAYER_ID}_${i}`, layer.tileMap, layer.tileMapId));
      }

      this.realCollisionLayer = this.createCollisionLayer(LevelMap.REAL_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.realWorld.collisionMap);
    }

    if (options.data.ghostWorld) {

      this.ghostWorldTiles = [];
      this.ghostBackgroundGraphicLayers = [];

      for (let i = 0; i < options.data.ghostWorld.backgroundGraphicLayers.length; i++) {
        const layer = options.data.ghostWorld.backgroundGraphicLayers[i];
        this.ghostWorldTiles.push(this.tilemap.addTilesetImage(layer.tileMapId));
        this.ghostBackgroundGraphicLayers.push(this.createGraphicLayer(`${LevelMap.GHOST_BACKGROUND_GRAPHIC_LAYER_ID}_${i}`, layer.tileMap, layer.tileMapId));
      }

      this.ghostCollisionLayer = this.createCollisionLayer(LevelMap.GHOST_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.ghostWorld.collisionMap);
      this.setGhostMode(this.ghostService.isGhostMode());
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
    if (this.ghostBackgroundGraphicLayers) {
      this.ghostBackgroundGraphicLayers.forEach(el => el.setAlpha(isGhost ? 1 : 0));
    }

    if (this.ghostForegroundGraphicLayers) {
      this.ghostForegroundGraphicLayers.forEach(el => el.setAlpha(isGhost ? 1 : 0));
    }
  }

  createForegroundLayers() {
    if (this.mapData.realWorld.foregroundGraphicLayers) {
      this.realForegroundGraphicLayers = [];

      for (let i = 0; i < this.mapData.realWorld.foregroundGraphicLayers.length; i++) {
        const layer = this.mapData.realWorld.foregroundGraphicLayers[i];
        this.realWorldTiles.push(this.tilemap.addTilesetImage(layer.tileMapId));
        this.realForegroundGraphicLayers.push(this.createGraphicLayer(`${LevelMap.REAL_FOREGROUND_GRAPHIC_LAYER_ID}_${i}`, layer.tileMap, layer.tileMapId, 1000));
      }
    }

    if (this.mapData.ghostWorld) {
      if (this.mapData.ghostWorld.foregroundGraphicLayers) {
        this.ghostForegroundGraphicLayers = [];

        for (let i = 0; i < this.mapData.ghostWorld.foregroundGraphicLayers.length; i++) {
          const layer = this.mapData.ghostWorld.foregroundGraphicLayers[i];
          this.ghostWorldTiles.push(this.tilemap.addTilesetImage(layer.tileMapId));
          this.ghostForegroundGraphicLayers.push(this.createGraphicLayer(`${LevelMap.GHOST_FOREGROUND_GRAPHIC_LAYER_ID}_${i}`, layer.tileMap, layer.tileMapId, 1000));
        }
      }
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

  private createGraphicLayer(layerId: string, tileMap: number[][], tileMapId: string, z: number = null) {
    const graphicLayer = this.tilemap.createBlankDynamicLayer(layerId, tileMapId, 0, 0);

    graphicLayer.putTilesAt(tileMap, 0, 0);
    graphicLayer.setAlpha(1);

    if (z) {
      graphicLayer.setZ(z);
    }

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