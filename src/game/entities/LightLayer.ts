import Phaser from "phaser";
import { AssetManager } from '../AssetManager';
import { LevelMap } from './LevelMap';

export class LightLayer {
  private static readonly ALPHA_PER_MS = 0.01;

  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private lastPos: Phaser.Math.Vector2;
  private map: LevelMap;

  private radius: number;
  private fogAlpha: number;
  private lightRolloff: number[];

  constructor(map: LevelMap) {
    const utilTiles = map.getTilemap().addTilesetImage(AssetManager.util.name);

    this.layer = map.getTilemap()
      .createBlankDynamicLayer(LevelMap.LIGHT_LAYER_ID, utilTiles, 0, 0)
      .fill(AssetManager.util.indices.black);

    this.lastPos = new Phaser.Math.Vector2({ x: -1, y: -1 });
    this.map = map;

    const settings = map.getMapData().lightSettings;
    this.radius = settings.playerLightRadius;
    this.fogAlpha = settings.fogAlpha;
    this.lightRolloff = this.generatePlayerLightRolloff(settings.playerLightRolloff, settings.fogAlpha);
  }

  update(pos: Phaser.Math.Vector2, bounds: Phaser.Geom.Rectangle, delta: number) {
    if (!this.lastPos.equals(pos)) {
      this.lastPos = pos.clone();
    }

    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {

        if (y < 0 || y >= this.map.getHeight() || x < 0 || x >= this.map.getWidth()) {
          continue;
        }

        const distance = Math.floor(new Phaser.Math.Vector2(x, y).distance(new Phaser.Math.Vector2(pos.x, pos.y)));

        let desiredAlpha = this.fogAlpha;
        if (distance <= this.radius) {
          const rolloffIndex = this.radius - distance;
          if (rolloffIndex < this.lightRolloff.length) {
            desiredAlpha = this.lightRolloff[rolloffIndex];
          } else {
            desiredAlpha = 0;
          }
        }

        const tile = this.layer.getTileAt(x, y);
        this.updateTileAlpha(desiredAlpha, delta, tile);
      }
    }

  }

  private updateTileAlpha(desiredAlpha: number, delta: number, tile: Phaser.Tilemaps.Tile) {
    // Update faster the further away we are from the desired value,
    // but restrict the lower bound so we don't get it slowing
    // down infinitley.
    const distance = Math.max(Math.abs(tile.alpha - desiredAlpha), 0.05);
    const updateFactor = LightLayer.ALPHA_PER_MS * delta * distance;
    if (tile.alpha > desiredAlpha) {
      tile.setAlpha(Phaser.Math.MinSub(tile.alpha, updateFactor, desiredAlpha));
    } else if (tile.alpha < desiredAlpha) {
      tile.setAlpha(Phaser.Math.MaxAdd(tile.alpha, updateFactor, desiredAlpha));
    }
  }

  private generatePlayerLightRolloff(n: number, fogAlpha: number): number[] {
    let res = [];
    const block = fogAlpha / (n + 1);
    for (let i = n; i > 0; i--) {
      res.push(block * i);
    }

    return res;
  }
}
