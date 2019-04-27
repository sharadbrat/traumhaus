import Phaser from 'phaser';
import { AssetManager } from '../AssetManager';
import { Player } from './Player';

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

export interface LightSettings {
  playerLightRadius: number;
  playerLightRolloff: number;
  fogAlpha: number;
}

export interface LevelMapData {
  id: string;
  width: number;
  height: number;
  collisionMap: CollisionDetector[][];
  tileMap: number[][];
  doors?: Door[];
  startPosition?: MapPosition;
  lightSettings: LightSettings;
}

export class LevelMap {
  static readonly GRAPHIC_LAYER_ID = 'GRAPHIC';
  static readonly COLLISION_LAYER_ID = 'COLLISION';
  static readonly DOOR_LAYER_ID = 'DOOR';
  static readonly LIGHT_LAYER_ID = 'LIGHT';

  private tilemap: Phaser.Tilemaps.Tilemap;
  private collisionLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private doorLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private mapData: LevelMapData;

  constructor(levelMapData: LevelMapData, scene: Phaser.Scene) {
    this.mapData = levelMapData;

    this.tilemap = this.createTilemap(scene, levelMapData.width, levelMapData.height);

    const environmentTiles = this.tilemap.addTilesetImage(AssetManager.environment.name);
    this.backgroundLayer = this.createBackgroundLayer(levelMapData.tileMap);

    this.collisionLayer = this.createCollisionLayer(this.tilemap, levelMapData, environmentTiles);
  }

  getTilemap(): Phaser.Tilemaps.Tilemap {
    return this.tilemap;
  }

  getCollisionLayer(): Phaser.Tilemaps.StaticTilemapLayer {
    return this.collisionLayer;
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

  private createTilemap(scene: Phaser.Scene, width: number, height: number): Phaser.Tilemaps.Tilemap {
    return scene.make.tilemap({
      tileWidth: AssetManager.environment.width,
      tileHeight: AssetManager.environment.height,
      width: width,
      height: height,
    });
  }

  private createBackgroundLayer(tileMap: number[][]) {
    const graphicLayer = this.tilemap.createBlankDynamicLayer(LevelMap.GRAPHIC_LAYER_ID, AssetManager.environment.name, 0, 0);

    graphicLayer.putTilesAt(tileMap, 0, 0);
    graphicLayer.setAlpha(1);

    return this.tilemap.convertLayerToStatic(graphicLayer);
  }

  private createCollisionLayer(tilemap: Phaser.Tilemaps.Tilemap, mapData: LevelMapData, tiles: Phaser.Tilemaps.Tileset): Phaser.Tilemaps.StaticTilemapLayer {
    const collisionLayer = tilemap.createBlankDynamicLayer(LevelMap.COLLISION_LAYER_ID, tiles, 0, 0);
    for (let x = 0; x < mapData.width; x++) {
      for (let y = 0; y < mapData.height; y++) {
        if (mapData.collisionMap[y][x] === 1) {
          collisionLayer.putTileAt(0x88, x, y);
        }
      }
    }
    collisionLayer.setCollisionBetween(0, 256);
    return tilemap.convertLayerToStatic(collisionLayer);
  }

  checkPlayerDoorCollision(body: Phaser.Physics.Arcade.Body): Door | null {
    const x = body.position.x;
    const y = body.position.y;

    for (let door of this.mapData.doors) {
      if (this.tilemap.worldToTileX(x) === door.fromPosition.x && this.tilemap.worldToTileY(y) === door.fromPosition.y) {
        return door;
      }
    }
  }
}