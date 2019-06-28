import { SpriteAsset } from '../assets';
import { GameDialog } from '../dialogs';
import { TriggerCallback } from '../TriggerManager';
import { GameScene } from '../scenes/GameScene';

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
  lightSettings: LightSettings;
  doors?: Door[];
  objects?: (LevelObjectData | EnemyLevelObjectData)[];
  themeId: string;
  ambients?: string[];
}

export enum LevelObjectAnimation {
  IDLE = 'idle',
  WALK = 'walk',
  WALK_BACK = 'walk_back',
  SLASH = 'slash',
  SLASH_DOWN = 'slash_down',
  SLASH_UP = 'slash_up',
  HIT = 'hit',
  DEATH = 'death',
  WALK_LEFT = 'walk_left',
}

export enum TriggerEvent {
  ON_COLLIDE,
  ON_ACTION,
  ON_IN_AREA,
  ON_IN_NEAR_AREA,
}

export interface Trigger {
  event: TriggerEvent;
  action: string;
  fixTime: number;
}

export enum LevelObjectType {
  STATIC,
  NPC,
  ENEMY
}

export enum EnemyLevelObjectType {
  CHASING,
  SHOOTING,
  PATROLING,
  DASHING,
}

export interface LevelObjectGraphicData {
  asset: SpriteAsset;
  offsetX: number;
  offsetY: number;
}

export interface LevelObjectData {
  id: string;
  type: LevelObjectType;
  isCollideable: boolean;

  position: {x: number, y: number, offsetX?: number, offsetY?: number};
  width: number;
  height: number;

  graphics: LevelObjectGraphicData;

  triggers?: Trigger[];

  meta?: LevelObjectMeta;
  inGhostWorld: boolean;
}

export interface EnemyLevelObjectData extends LevelObjectData {
  meta?: EnemyLevelObjectMeta;
}

export interface LevelObjectMeta {
  talkable?: boolean;
}

export interface EnemyLevelObjectMeta extends LevelObjectMeta {
  patrol?: {
    to: MapPosition;
    from: MapPosition;
    speed: number;
    delay: number;
  };
  chase?: {
    speed: number;
    radius: number;
  };
  enemyType: EnemyLevelObjectType;
}

export interface LevelMapData {
  id: string;
  width: number;
  height: number;
  realWorld?: World;
  ghostWorld?: World;
  startPosition?: MapPosition;
  triggerActions?: TriggerAction[];
  dialogs?: GameDialog[];
}

export interface TriggerAction {
  action: string;
  callback: TriggerCallback;
}

export interface LevelMapConstructorOptions {
  data: LevelMapData;
  scene: GameScene;
}
