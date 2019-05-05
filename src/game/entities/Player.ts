import Phaser from "phaser";
import { AssetManager, SpriteAsset } from '../AssetManager';
import { GameSoundService } from '../../service/GameSoundService';
import { GameGhostService } from '../../service/GameGhostService';

const speed = 125;
const attackSpeed = 500;
const attackDuration = 165;
const attackCooldown = attackDuration * 2;

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
}

export class Player {

  private sprite: Phaser.Physics.Arcade.Sprite;
  private ghostSprite: Phaser.Physics.Arcade.Sprite;

  private keys: Keys;

  private attackUntil: number;
  private attackLockedUntil: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private body: Phaser.Physics.Arcade.Body;
  private scene: Phaser.Scene;
  private currentAnimationAsset: SpriteAsset;

  private ghostService: GameGhostService;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.scene = scene;

    this.ghostService = GameGhostService.getInstance();

    // this.sprite = this.setupSprite(x, y, AssetManager.spriteAssets.player);

    if (this.ghostService.isGhostMode()) {
      this.sprite = this.setupSprite(x, y, AssetManager.spriteAssets.ghostPlayer);
      this.currentAnimationAsset = AssetManager.spriteAssets.ghostPlayer
    } else {
      this.sprite = this.setupSprite(x, y, AssetManager.spriteAssets.player);
      this.currentAnimationAsset = AssetManager.spriteAssets.player
    }

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      w: "w",
      a: "a",
      s: "s",
      d: "d"
    }) as Keys;

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
    const particles = scene.add.particles(AssetManager.spriteAssets.ghostPlayer.name);
    this.emitter = particles.createEmitter({
      alpha: { start: 0.7, end: 0, ease: "Cubic.easeOut" },
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    this.emitter.stop();

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
  }

  update(time: number) {
    const keys = this.keys;
    let attackAnim = "";
    let moveAnim = "";

    if (time < this.attackUntil) {
      return;
    }
    this.body.setVelocity(0);

    const left = keys.left.isDown || keys.a.isDown;
    const right = keys.right.isDown || keys.d.isDown;
    const up = keys.up.isDown || keys.w.isDown;
    const down = keys.down.isDown || keys.s.isDown;

    if (!this.body.blocked.left && left) {
      this.body.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (!this.body.blocked.right && right) {
      this.body.setVelocityX(speed);
      this.sprite.setFlipX(false);
    }

    if (!this.body.blocked.up && up) {
      this.body.setVelocityY(-speed);
    } else if (!this.body.blocked.down && down) {
      this.body.setVelocityY(speed);
    }


    const animationPrefix = this.currentAnimationAsset.name;
    if (left || right) {
      moveAnim = animationPrefix + this.currentAnimationAsset.animations.walk.name;
      attackAnim = animationPrefix + this.currentAnimationAsset.animations.slash.name;
    } else if (down) {
      moveAnim = animationPrefix + this.currentAnimationAsset.animations.walk.name;
      attackAnim = animationPrefix + this.currentAnimationAsset.animations.slashDown.name;
    } else if (up) {
      moveAnim = animationPrefix + this.currentAnimationAsset.animations.walkBack.name;
      attackAnim = animationPrefix + this.currentAnimationAsset.animations.slashUp.name;
    } else {
      moveAnim = animationPrefix + this.currentAnimationAsset.animations.idle.name;
    }

    // if (left || right) {
    //   moveAnim = AssetManager.player.animations.walk.name;
    //   attackAnim = AssetManager.player.animations.slash.name;
    // } else if (down) {
    //   moveAnim = AssetManager.player.animations.walk.name;
    //   attackAnim = AssetManager.player.animations.slashDown.name;
    // } else if (up) {
    //   moveAnim = AssetManager.player.animations.walkBack.name;
    //   attackAnim = AssetManager.player.animations.slashUp.name;
    // } else {
    //   moveAnim = AssetManager.player.animations.idle.name;
    // }

    if (
      keys.space!.isDown &&
      time > this.attackLockedUntil &&
      this.body.velocity.length() > 0 &&
      this.ghostService.isGhostMode()
    ) {
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration + attackCooldown;
      this.body.velocity.normalize().scale(attackSpeed);
      this.sprite.anims.play(attackAnim, true);
      this.emitter.start();
      this.sprite.setBlendMode(Phaser.BlendModes.ADD);
      GameSoundService.getInstance().playSound(AssetManager.soundAssets.dash.name);
    } else {
      this.sprite.anims.play(moveAnim, true);
      this.body.velocity.normalize().scale(speed);
      this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      if (this.emitter.on) {
        this.emitter.stop();
      }
    }
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body;
  }

  public setGhostMode(value: boolean) {
    const spriteAsset = value ? AssetManager.spriteAssets.ghostPlayer : AssetManager.spriteAssets.player;
    this.sprite.setTexture(spriteAsset.name);
    this.currentAnimationAsset = spriteAsset;
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  private setupSprite(x: number, y: number, asset: SpriteAsset) {
    const offsetX = 12;
    const offsetY = 20;

    const sizeX = 8;
    const sizeY = 8;

    const sprite = this.scene.physics.add.sprite(x + sizeX, y, asset.name, 0);
    sprite.setSize(sizeX, sizeY);
    sprite.setOffset(offsetX, offsetY);
    sprite.anims.play(asset.name + asset.animations.idle.name);

    return sprite;
  }
}
