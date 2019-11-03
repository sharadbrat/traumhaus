import {
  bossThemeAudioAsset,
  caveGhostThemeAudioAsset,
  caveThemeAudioAsset,
  cityAmbientAudioAsset,
  dashSoundAsset,
  footStepDirtSoundAsset,
  footStepFloorSoundAsset,
  footStepGhostSoundAsset,
  footStepGrassSoundAsset,
  footStepPlainSoundAsset,
  footStepStoneSoundAsset,
  forestAmbientAudioAsset,
  gateSoundAsset,
  ghostThemeAudioAsset,
  hitSoundAsset,
  libraryThemeAudioAsset,
  mainThemeAudioAsset,
  parkGhostThemeAudioAsset,
  parkThemeAudioAsset,
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
  stage2ghostGraphicalAsset,
  projectileGraphicalAsset,
  stage3realGraphicalAsset,
  stage3ghostGraphicalAsset,
  glowingGraphicalAsset,
  stage4realGraphicalAsset,
  stage4ghostGraphicalAsset,
  stage5realGraphicalAsset,
  stage5ghostGraphicalAsset,
  stage6realGraphicalAsset,
  bookGraphicalAsset,
  enemyGhostGraphicalAsset,
  stageCorridorRealGraphicalAsset,
  enemySpiderParkGraphicalAsset,
  stageStreetRealGraphicalAsset,
  stage6ghostGraphicalAsset,
  bossGraphicalAsset,
  lumberGraphicalAsset,
  lumberSonGraphicalAsset,
  projectileBossGraphicalAsset,
  stage70realGraphicalAsset,
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
    stage4realGraphicalAsset,
    stage4ghostGraphicalAsset,
    stage5realGraphicalAsset,
    stage5ghostGraphicalAsset,
    stage6realGraphicalAsset,
    stageCorridorRealGraphicalAsset,
    stageStreetRealGraphicalAsset,
    stage6ghostGraphicalAsset,
    stage70realGraphicalAsset,
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
    glowingGraphicalAsset,
    bookGraphicalAsset,
    enemyGhostGraphicalAsset,
    enemySpiderParkGraphicalAsset,
    bossGraphicalAsset,
    lumberGraphicalAsset,
    lumberSonGraphicalAsset,
    projectileBossGraphicalAsset,
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
    caveGhostThemeAudioAsset,
    bossThemeAudioAsset,
    libraryThemeAudioAsset,
  ];

  public static readonly graphicalAssets = {
    stage1real: stage1realGraphicalAsset,
    stageCorridorReal: stageCorridorRealGraphicalAsset,
    stageStreetReal: stageStreetRealGraphicalAsset,
    stage1ghost: stage1ghostGraphicalAsset,
    stage2real: stage2realGraphicalAsset,
    stage2ghost: stage2ghostGraphicalAsset,
    stage3real: stage3realGraphicalAsset,
    stage3ghost: stage3ghostGraphicalAsset,
    stage4real: stage4realGraphicalAsset,
    stage4ghost: stage4ghostGraphicalAsset,
    stage5real: stage5realGraphicalAsset,
    stage5ghost: stage5ghostGraphicalAsset,
    stage6real: stage6realGraphicalAsset,
    stage6ghost: stage6ghostGraphicalAsset,
    stage70Real: stage70realGraphicalAsset,
    util: utilGraphicalAsset,
  };

  public static readonly spriteAssets = {
    player: playerGraphicalAsset,
    ghostPlayer: ghostPlayerGraphicalAsset,
    professor: professorGraphicalAsset,
    lumber: lumberGraphicalAsset,
    lumberSon: lumberSonGraphicalAsset,
    studentCard: studentCardGraphicalAsset,
    invisible: invisibleGraphicalAsset,
    enemySpider: enemySpiderGraphicalAsset,
    enemyGhost: enemyGhostGraphicalAsset,
    shootingObject: shootingObjectGraphicalAsset,
    transformEssence: transformEssenceGraphicalAsset,
    projectile: projectileGraphicalAsset,
    bossProjectile: projectileBossGraphicalAsset,
    glowing: glowingGraphicalAsset,
    book: bookGraphicalAsset,
    enemySpiderPark: enemySpiderParkGraphicalAsset,
    boss: bossGraphicalAsset,
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
