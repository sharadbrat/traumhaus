import {
  caveThemeAudioAsset,
  cityAmbientAudioAsset,
  dashSoundAsset, footStepDirtSoundAsset,
  footStepFloorSoundAsset,
  footStepGhostSoundAsset,
  footStepGrassSoundAsset,
  footStepPlainSoundAsset,
  footStepStoneSoundAsset,
  forestAmbientAudioAsset, gateSoundAsset,
  ghostThemeAudioAsset,
  hitSoundAsset,
  mainThemeAudioAsset, parkGhostThemeAudioAsset, parkThemeAudioAsset,
  shootSoundAsset,
  SoundAsset
} from './SoundAssets';
import {
  stage1realGraphicalAsset,
  stage1ghostGraphicalAsset,
  ghostPlayerGraphicalAsset,
  GraphicalAsset,
  playerGraphicalAsset,
  professorGraphicalAsset,
  SpriteAsset,
  utilGraphicalAsset,
  Animation,
  invisibleGraphicalAsset,
  studentCardGraphicalAsset,
  enemySpiderGraphicalAsset,
  transformEssenceGraphicalAsset,
  shootingObjectGraphicalAsset,
  stage2realGraphicalAsset,
  stage2ghostGraphicalAsset, projectileGraphicalAsset, stage3realGraphicalAsset, stage3ghostGraphicalAsset
} from './GraphicalAssets';

export interface Asset {
  name: string;
  file: string;
}

export class AssetManager {
  public static readonly TILE_SIZE = 16;

  public static readonly tiles: GraphicalAsset[] = [
    stage1realGraphicalAsset,
    stage1ghostGraphicalAsset,
    stage2realGraphicalAsset,
    stage2ghostGraphicalAsset,
    utilGraphicalAsset,
    stage3realGraphicalAsset,
    stage3ghostGraphicalAsset,
  ];

  public static readonly sprites: SpriteAsset[] = [
    playerGraphicalAsset,
    ghostPlayerGraphicalAsset,
    professorGraphicalAsset,
    invisibleGraphicalAsset,
    studentCardGraphicalAsset,
    enemySpiderGraphicalAsset,
    shootingObjectGraphicalAsset,
    transformEssenceGraphicalAsset,
    projectileGraphicalAsset,
  ];

  public static readonly sounds: SoundAsset[] = [
    dashSoundAsset,
    shootSoundAsset,
    hitSoundAsset,
    gateSoundAsset,
    footStepDirtSoundAsset,
    footStepFloorSoundAsset,
    footStepGhostSoundAsset,
    footStepGrassSoundAsset,
    footStepPlainSoundAsset,
    footStepStoneSoundAsset,
  ];

  public static readonly musicThemes: SoundAsset[] = [
    mainThemeAudioAsset,
    ghostThemeAudioAsset,
    forestAmbientAudioAsset,
    cityAmbientAudioAsset,
    caveThemeAudioAsset,
    parkThemeAudioAsset,
    parkGhostThemeAudioAsset,
  ];

  public static readonly graphicalAssets = {
    stage1real: stage1realGraphicalAsset,
    stage1ghost: stage1ghostGraphicalAsset,
    stage2real: stage2realGraphicalAsset,
    stage2ghost: stage2ghostGraphicalAsset,
    stage3real: stage3realGraphicalAsset,
    stage3ghost: stage3ghostGraphicalAsset,
    util: utilGraphicalAsset,
  };

  public static readonly spriteAssets = {
    player: playerGraphicalAsset,
    ghostPlayer: ghostPlayerGraphicalAsset,
    professor: professorGraphicalAsset,
    studentCard: studentCardGraphicalAsset,
    invisible: invisibleGraphicalAsset,
    enemySpider: enemySpiderGraphicalAsset,
    shootingObject: shootingObjectGraphicalAsset,
    transformEssence: transformEssenceGraphicalAsset,
    projectile: projectileGraphicalAsset,
  };

  public static readonly soundAssets = {
    dash: dashSoundAsset,
    shoot: shootSoundAsset,
    hit: hitSoundAsset,
    gate: gateSoundAsset,
    footsteps: {
      dirt: footStepDirtSoundAsset,
      floor: footStepFloorSoundAsset,
      stage1ghost: footStepGhostSoundAsset,
      grass: footStepGrassSoundAsset,
      plain: footStepPlainSoundAsset,
      stone: footStepStoneSoundAsset,
    }
  };

  private game: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game
  }

  public static loadAssets(scene: Phaser.Scene) {
    AssetManager.tiles.forEach(el => scene.load.image(el.name, el.file));

    AssetManager.sprites.forEach(el => AssetManager.loadSprite(scene, el));

    AssetManager.sounds.forEach(el => scene.load.audio(el.name, el.file));
    AssetManager.musicThemes.forEach(el => scene.load.audio(el.name, el.file));
  }

  public static getSpriteAssetByKey(key: string): SpriteAsset {
    return this.sprites.find(el => el.name === key);
  }

  public static loadAnimations(scene: Phaser.Scene) {
    AssetManager.sprites.forEach(el => AssetManager.loadSpriteAnimations(scene, el));
  }

  private static loadSprite(scene: Phaser.Scene, sprite: SpriteAsset) {
    scene.load.spritesheet(sprite.name, sprite.file, {
      frameHeight: sprite.height,
      frameWidth: sprite.width
    });
  }

  private static loadSpriteAnimations(scene: Phaser.Scene, sprite: SpriteAsset) {
    Object.values(sprite.animations).forEach((anim: Animation) => {
      const key = `${sprite.name}__${anim.name}`;
      if (!scene.anims.get(key)) {
        scene.anims.create({
          key: key,
          frames: scene.anims.generateFrameNumbers(sprite.name, anim),
          frameRate: anim.frameRate,
          repeat: anim.repeat ? -1 : 0
        });
      }
    });
  }
}
