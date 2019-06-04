import Phaser from 'phaser';
import nipplejs, { JoystickManager } from 'nipplejs';

import { AssetManager, SpriteAsset } from '../assets';
import { GameGhostService, GameProgressService, GameSoundService } from '../../service';
import { LevelMap } from './LevelMap';
import { TriggerContents, TriggerManager } from '../TriggerManager';
import { NPC_TRIGGERS_ACTIONS } from './NPCLevelObject';
import { ENEMY_TRIGGERS_ACTIONS } from './EnemyLevelObject';
import { LevelObjectAnimation } from './model';
import { ControlsType, GameControlsService, Keys } from '../../service/GameControlsService';

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
  private joystickKeys: {
    horizontal: number,
    vertical: number,
    dash: boolean,
    interact: boolean,
    switch: boolean,
    shoot: boolean,
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
      if (content.services.progress.getProgress().isVulnerable) {
        this.onPlayerHit(content);
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
    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {

      const animationPrefix = this.currentAnimationAsset.name;

      const speedX = this.joystickKeys.horizontal * speed;
      if (speedX > 0 && !this.body.blocked.right) {
        this.body.setVelocityX(speedX);
      } else if (speedX < 0 && !this.body.blocked.left) {
        this.body.setVelocityX(speedX);
      }

      const speedY = this.joystickKeys.vertical * speed;
      if (speedY > 0 && !this.body.blocked.down) {
        this.body.setVelocityY(speedY);
      } else if (speedY < 0 && !this.body.blocked.up) {
        this.body.setVelocityY(speedY);
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

      this.sprite.setFlipX(this.joystickKeys.horizontal < 0);

      if (
        this.joystickKeys.dash &&
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
    } else {
      const left = keys.left.isDown;
      const right = keys.right.isDown;
      const up = keys.up.isDown;
      const down = keys.down.isDown;

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

      if (down) {
        moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK].name}`;
        attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH_DOWN].name}`;
      } else if (up) {
        moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK_BACK].name}`;
        attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH_UP].name}`;
      } else if (left || right) {
        moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.WALK].name}`;
        attackAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.SLASH].name}`;
      } else {
        moveAnim = `${animationPrefix}__${this.currentAnimationAsset.animations[LevelObjectAnimation.IDLE].name}`;
      }

      if (
        this.keys.dash.isDown &&
        time > this.attackLockedUntil &&
        this.body.velocity.length() > 0 &&
        this.ghostService.isGhostMode() &&
        GameProgressService.getInstance().getProgress().isControllable
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
        this.body.velocity.normalize().scale(speed);
        this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
        if (this.emitter.on) {
          this.emitter.stop();
        }
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
      this.joystick = nipplejs.create({
        zone: document.getElementById('joystick'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
      });

      this.joystickKeys = {
        horizontal: 0,
        vertical: 0,
        dash: false,
        interact: false,
        switch: false,
        shoot: false,
      };

      this.joystick.on('move', (evt, data) => {
        const force = Math.min(data.force, 1);
        // cos for horizontal
        this.joystickKeys.horizontal = Math.cos(data.angle.radian) * force;
        // sin for vertical
        this.joystickKeys.vertical = -Math.sin(data.angle.radian) * force;
      });

      this.joystick.on('end', () => {
        this.joystickKeys.horizontal = 0;
        this.joystickKeys.vertical = 0;
      });

      document.getElementById('button-dash').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.dash = true;
      });

      document.getElementById('button-dash').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.dash = false;
      });

      document.getElementById('button-interact').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.interact = true;
      });

      document.getElementById('button-interact').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.interact = false;
      });

      document.getElementById('button-switch').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.switch = true;
      });

      document.getElementById('button-switch').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.switch = false;
      });

      document.getElementById('button-shoot').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.shoot = true;
      });

      document.getElementById('button-shoot').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.shoot = false;
      });
    } else if (this.controlsMode === ControlsType.GAMEPAD) {
      this.keys = this.scene.input.keyboard.addKeys(GameControlsService.getInstance().getGamepadControls()) as Keys;
    } else {
      this.keys = this.scene.input.keyboard.addKeys(GameControlsService.getInstance().getKeyboardControls()) as Keys;
    }
  }
}
