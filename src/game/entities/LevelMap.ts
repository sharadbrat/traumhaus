import Phaser from 'phaser';

import { AssetManager } from '../assets';
import { GameGhostService } from '../../service';
import { CollisionDetector, Door, LevelMapConstructorOptions, LevelMapData } from './model';

export class LevelMap {
  static readonly REAL_BACKGROUND_GRAPHIC_LAYER_ID = 'REAL_BACKGROUND_GRAPHIC';
  static readonly REAL_FOREGROUND_GRAPHIC_LAYER_ID = 'REAL_FOREGROUND_GRAPHIC';
  static readonly REAL_COLLISION_LAYER_ID = 'REAL_COLLISION';

  static readonly GHOST_BACKGROUND_GRAPHIC_LAYER_ID = 'GHOST_BACKGROUND_GRAPHIC';
  static readonly GHOST_FOREGROUND_GRAPHIC_LAYER_ID = 'GHOST_FOREGROUND_GRAPHIC';
  static readonly GHOST_COLLISION_LAYER_ID = 'GHOST_COLLISION';

  static readonly LIGHT_LAYER_ID = 'LIGHT';

  static readonly BACKGROUND_LAYER_DEPTH = 1;
  static readonly FOREGROUND_LAYER_DEPTH = 100;
  static readonly LIGHT_LAYER_DEPTH = 1000;
  static readonly OBJECT_LAYER_DEPTH = 10;

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

    this.utilTiles = this.tilemap.addTilesetImage(AssetManager.graphicalAssets.util.name);

    if (options.data.realWorld) {
      this.realBackgroundGraphicLayers = [];
      this.realWorldTiles = [];

      for (let i = 0; i < options.data.realWorld.backgroundGraphicLayers.length; i++) {
        const layerData = options.data.realWorld.backgroundGraphicLayers[i];
        this.realWorldTiles.push(this.tilemap.addTilesetImage(layerData.tileMapId, null, 16, 16, 1, 2));
        const layer = this.createGraphicLayer(`${LevelMap.REAL_BACKGROUND_GRAPHIC_LAYER_ID}_${i}`, layerData.tileMap, layerData.tileMapId);
        layer.setDepth(LevelMap.BACKGROUND_LAYER_DEPTH);
        this.realBackgroundGraphicLayers.push(layer);
      }

      this.realCollisionLayer = this.createCollisionLayer(LevelMap.REAL_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.realWorld.collisionMap);
    }

    if (options.data.ghostWorld) {

      this.ghostWorldTiles = [];
      this.ghostBackgroundGraphicLayers = [];

      for (let i = 0; i < options.data.ghostWorld.backgroundGraphicLayers.length; i++) {
        const layerData = options.data.ghostWorld.backgroundGraphicLayers[i];
        this.ghostWorldTiles.push(this.tilemap.addTilesetImage(layerData.tileMapId, null, 16, 16, 1, 2));
        const layer = this.createGraphicLayer(`${LevelMap.GHOST_BACKGROUND_GRAPHIC_LAYER_ID}_${i}`, layerData.tileMap, layerData.tileMapId);
        layer.setDepth(LevelMap.BACKGROUND_LAYER_DEPTH);
        this.ghostBackgroundGraphicLayers.push(layer);
      }

      this.ghostCollisionLayer = this.createCollisionLayer(LevelMap.GHOST_COLLISION_LAYER_ID, options.data.width, options.data.height, options.data.ghostWorld.collisionMap);
    }

    this.createForegroundLayers();

    this.setGhostMode(this.ghostService.isGhostMode());
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

  getRealCollisionLayer(): Phaser.Tilemaps.StaticTilemapLayer {
    return this.realCollisionLayer;
  }

  getGhostCollisionLayer(): Phaser.Tilemaps.StaticTilemapLayer {
    return this.ghostCollisionLayer;
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
    const {x, y} = body.position;

    if (this.ghostService.isGhostMode()) {
      if (this.mapData.ghostWorld.doors) {
        for (let door of this.mapData.ghostWorld.doors) {
          if (this.tilemap.worldToTileX(x) === door.fromPosition.x && this.tilemap.worldToTileY(y) === door.fromPosition.y) {
            return door;
          }
        }
      }
    } else {
      if (this.mapData.realWorld.doors) {
        for (let door of this.mapData.realWorld.doors) {
          if (this.tilemap.worldToTileX(x) === door.fromPosition.x && this.tilemap.worldToTileY(y) === door.fromPosition.y) {
            return door;
          }
        }
      }
    }
  }

  setGhostMode(isGhost: boolean) {
    // Handle ghost graphics
    if (this.ghostBackgroundGraphicLayers) {
      this.ghostBackgroundGraphicLayers.forEach(el => el.setVisible(isGhost));
    }

    if (this.ghostForegroundGraphicLayers) {
      this.ghostForegroundGraphicLayers.forEach(el => el.setVisible(isGhost));
    }

    // Handle real graphics
    if (this.realForegroundGraphicLayers) {
      this.realForegroundGraphicLayers.forEach(el => el.setVisible(!isGhost));
    }

    if (this.realBackgroundGraphicLayers) {
      this.realBackgroundGraphicLayers.forEach(el => el.setVisible(!isGhost));
    }
  }

  createForegroundLayers() {
    if (this.mapData.realWorld.foregroundGraphicLayers) {
      this.realForegroundGraphicLayers = [];

      for (let i = 0; i < this.mapData.realWorld.foregroundGraphicLayers.length; i++) {
        const layerData = this.mapData.realWorld.foregroundGraphicLayers[i];
        this.realWorldTiles.push(this.tilemap.addTilesetImage(layerData.tileMapId));
        const layer = this.createGraphicLayer(`${LevelMap.REAL_FOREGROUND_GRAPHIC_LAYER_ID}_${i}`, layerData.tileMap, layerData.tileMapId);
        layer.setDepth(LevelMap.FOREGROUND_LAYER_DEPTH);
        this.realForegroundGraphicLayers.push(layer);
      }
    }

    if (this.mapData.ghostWorld) {
      if (this.mapData.ghostWorld.foregroundGraphicLayers) {
        this.ghostForegroundGraphicLayers = [];

        for (let i = 0; i < this.mapData.ghostWorld.foregroundGraphicLayers.length; i++) {
          const layerData = this.mapData.ghostWorld.foregroundGraphicLayers[i];
          this.ghostWorldTiles.push(this.tilemap.addTilesetImage(layerData.tileMapId));
          const layer = this.createGraphicLayer(`${LevelMap.GHOST_FOREGROUND_GRAPHIC_LAYER_ID}_${i}`, layerData.tileMap, layerData.tileMapId);
          layer.setDepth(LevelMap.FOREGROUND_LAYER_DEPTH);
          this.ghostForegroundGraphicLayers.push(layer);
        }
      }
    }

  }

  private createTilemap(scene: Phaser.Scene, width: number, height: number): Phaser.Tilemaps.Tilemap {
    const tilemap = scene.make.tilemap({
      tileWidth: AssetManager.TILE_SIZE,
      tileHeight: AssetManager.TILE_SIZE,
      width: width,
      height: height,
      insertNull: true,
    });
    tilemap.setBaseTileSize(AssetManager.TILE_SIZE, AssetManager.TILE_SIZE);
    return tilemap;
  }

  private createGraphicLayer(layerId: string, tileMap: number[][], tileMapId: string): Phaser.Tilemaps.StaticTilemapLayer {
    const graphicLayer = this.tilemap.createBlankDynamicLayer(layerId, tileMapId, 0, 0, undefined, undefined, 16, 16);

    graphicLayer.putTilesAt(tileMap, 0, 0);
    graphicLayer.setAlpha(1);

    return this.tilemap.convertLayerToStatic(graphicLayer);
  }

  private createCollisionLayer(layerId: string, width: number, height: number, collisionMap: CollisionDetector[][]): Phaser.Tilemaps.StaticTilemapLayer {
    const collisionLayer = this.tilemap.createBlankDynamicLayer(layerId, this.utilTiles, 0, 0, undefined, undefined, 16, 16);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (collisionMap[y][x] === 1) {
          collisionLayer.putTileAt(AssetManager.graphicalAssets.util.indices.transparent, x, y);
        }
      }
    }
    collisionLayer.setCollisionBetween(0, 256);
    return this.tilemap.convertLayerToStatic(collisionLayer);
  }
}