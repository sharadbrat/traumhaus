import Phaser from 'phaser';
import { JoystickManager } from 'nipplejs';

import { AssetManager, SpriteAsset } from '../assets';
import { GameGhostService, GameProgressService, GameSoundService } from '../../service';
import { LevelMap } from './LevelMap';
import { TriggerContents, TriggerManager } from '../TriggerManager';
import { NPC_TRIGGERS_ACTIONS } from './NPCLevelObject';
import { ENEMY_TRIGGERS_ACTIONS, EnemyLevelObject } from './EnemyLevelObject';
import { LevelObjectAnimation } from './model';
import { ControlsType, GameControlsService, JoystickKeys, Keys } from '../../service/GameControlsService';

const speed = 125;
const attackSpeed = 500;
const attackDuration = 165;
const attackCooldown = attackDuration * 2;

export class Player {
  private static readonly INVULNERABLE_TIME = 3000;

  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly body: Phaser.Physics.Arcade.Body;
  private keys: Keys;

  private attackUntil: number;
  private attackLockedUntil: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private scene: Phaser.Scene;
  private currentAnimationAsset: SpriteAsset;

  private ghostService: GameGhostService;
  private controlsMode: ControlsType;
  private joystick: JoystickManager;
  private joystickKeys: JoystickKeys = {
    horizontal: 0,
    vertical: 0,
    dash: false,
    interact: false,
    switch: false,
    shoot: false,
  };

  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.scene = scene;

    this.ghostService = GameGhostService.getInstance();

    if (this.ghostService.isGhostMode()) {
      this.sprite = this.setupSprite(x, y, AssetManager.spriteAssets.ghostPlayer);
      this.currentAnimationAsset = AssetManager.spriteAssets.ghostPlayer
    } else {
      this.sprite = this.setupSprite(x, y, AssetManager.spriteAssets.player);
      this.currentAnimationAsset = AssetManager.spriteAssets.player
    }

    this.setupControls();

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
    const particles = scene.add.particles(AssetManager.spriteAssets.ghostPlayer.name);
    this.emitter = particles.createEmitter({
      alpha: {start: 0.7, end: 0, ease: 'Cubic.easeOut'},
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    particles.setDepth(LevelMap.OBJECT_LAYER_DEPTH);
    this.emitter.stop();

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;

    TriggerManager.add(NPC_TRIGGERS_ACTIONS.ON_IN_NEAR_AREA, (content: TriggerContents) => {
      // todo: add glowing implementation
      console.log('near');
    });

    TriggerManager.add(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, (content: TriggerContents) => {
      if (this.attackUntil > content.scene.time.now) {
        (content.object as EnemyLevelObject).onHit(content);
      } else {
        if (content.services.progress.getProgress().isVulnerable) {
          this.onPlayerHit(content);
        }
      }
    });
  }

  update(time: number) {
    if (time < this.attackUntil) {
      return;
    }

    this.body.setVelocity(0);

    if (GameProgressService.getInstance().getProgress().isControllable) {
      this.updateControls(time)
    }
  }

  updateControls(time: number) {
    const keys = this.keys;
    let attackAnim = '';
    let moveAnim = '';

    let speedX = 0;
    let speedY = 0;

    let isDashing = false;
    const animationPrefix = this.currentAnimationAsset.name;

    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {

      speedX = this.joystickKeys.horizontal * speed;
      speedY = this.joystickKeys.vertical * speed;
      isDashing = this.joystickKeys.dash;

    } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
      const pad = GameControlsService.getInstance().getGamepad();
      if (pad) {
        speedX = Math.abs(pad.axes[0]) > 0.01 ? pad.axes[0] * speed : 0;
        speedY = Math.abs(pad.axes[1]) > 0.01 ? pad.axes[1] * speed : 0;
        isDashing = pad.buttons[2].pressed;
      }
    } else {
      // fallback to keyboard
      const left = keys.left.isDown ? -1 : 0;
      const right = keys.right.isDown ? 1 : 0;
      const up = keys.up.isDown ? -1 : 0;
      const down = keys.down.isDown ? 1 : 0;

      speedX = (left + right) * speed;
      speedY = (up + down) * speed;
      isDashing = this.keys.dash.isDown;
    }

    GameSoundService.getInstance().setFootstepPlay(!!(speedY || speedX));

    this.sprite.setFlipX(speedX < 0);

    if (speedY > 0 && !this.body.blocked.down) {
      this.body.setVelocityY(speedY);
    } else if (speedY < 0 && !this.body.blocked.up) {
      this.body.setVelocityY(speedY);
    }

    if (speedX > 0 && !this.body.blocked.right) {
      this.body.setVelocityX(speedX);
    } else if (speedX < 0 && !this.body.blocked.left) {
      this.body.setVelocityX(speedX);
    }

    if (speedY > 0) {
      moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK].name}`;
      attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH_DOWN].name}`;
    } else if (speedY < 0) {
      moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK_BACK].name}`;
      attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH_UP].name}`;
    } else if (speedX) {
      moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK].name}`;
      attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH].name}`;
    } else {
      moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.IDLE].name}`;
    }


    if (
      isDashing &&
      time > this.attackLockedUntil &&
      this.body.velocity.length() > 0 &&
      this.ghostService.isGhostMode()
    ) {
      GameSoundService.getInstance().playSfx(AssetManager.soundAssets.dash.name);
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration + attackCooldown;
      this.body.velocity.normalize().scale(attackSpeed);
      this.sprite.anims.play(attackAnim, true);
      this.emitter.start();
      this.sprite.setBlendMode(Phaser.BlendModes.ADD);
    } else {
      this.sprite.anims.play(moveAnim, true);
      this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      if (this.emitter.on) {
        this.emitter.stop();
      }
    }
  }

  getBody(): Phaser.Physics.Arcade.Body {
    return this.body;
  }

  setGhostMode(value: boolean) {
    const spriteAsset = value ? AssetManager.spriteAssets.ghostPlayer : AssetManager.spriteAssets.player;
    this.sprite.setTexture(spriteAsset.name);
    this.currentAnimationAsset = spriteAsset;
  }

  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  getKeys(): Keys {
    return this.keys;
  }

  getJoystickKeys() {
    return this.joystickKeys;
  }

  public getPosition(): Phaser.Math.Vector2 {
    return this.sprite.body.position;
  }

  private setupSprite(x: number, y: number, asset: SpriteAsset) {
    const offsetX = 12;
    const offsetY = 20;

    const sizeX = 8;
    const sizeY = 8;

    const sprite = this.scene.physics.add.sprite(x + sizeX, y, asset.name, 0);
    sprite.setSize(sizeX, sizeY);
    sprite.setOffset(offsetX, offsetY);
    sprite.anims.play(`${asset.name}__${asset.animations.idle.name}`);
    sprite.setDepth(LevelMap.OBJECT_LAYER_DEPTH);
    // I had to comment this because it leaded to bugs when mobile version is played 0_0
    // sprite.setCollideWorldBounds(true);

    return sprite;
  }

  private onPlayerHit(content: TriggerContents) {
    const enemyPos = content.object.getPosition();
    const playerPos = content.player.getPosition();

    const force = {
      x: playerPos.x - enemyPos.x,
      y: playerPos.y - enemyPos.y,
    };

    // normalize
    let norm = Math.abs(force.x) + Math.abs(force.y);
    if (norm === 0) {
      norm = 1;
    }

    force.x = force.x / norm;
    force.y = force.y / norm;

    content.services.progress.getProgress().isVulnerable = false;
    GameProgressService.getInstance().setControllable(false);
    this.sprite.setAcceleration(force.x * 10000, force.y * 10000);
    this.sprite.setAlpha(0.5);
    this.sprite.setTint(0xFFAAAA);

    content.scene.getCamera().shake(100, 0.0007);

    setTimeout(() => {
      content.scene.getCamera().flash(Player.INVULNERABLE_TIME * 2 / 3, 128, 32, 32, true);
    }, 70);

    setTimeout(() => {
      GameProgressService.getInstance().setControllable(true);
      this.sprite.setAcceleration(0);
    }, 200);

    setTimeout(() => {
      this.sprite.setAlpha(1);
      this.sprite.setTint(0xFFFFFF);
      content.services.progress.getProgress().isVulnerable = true;
    }, Player.INVULNERABLE_TIME);

    content.services.sound.playSfx(AssetManager.soundAssets.hit.name);

    GameProgressService.getInstance().decreaseHealth();
  }

  private setupControls() {
    this.controlsMode = GameControlsService.getInstance().getMode();

    if (this.controlsMode === ControlsType.ON_SCREEN) {
      this.joystick = GameControlsService.getInstance().getJoystick(this.joystickKeys);
    } else if (this.controlsMode === ControlsType.KEYBOARD) {
      this.keys = this.scene.input.keyboard.addKeys(GameControlsService.getInstance().getKeyboardControls()) as Keys;
    }
  }
}
