import {
  _decorator,
  Component,
  EventKeyboard,
  Input,
  input,
  Node,
  KeyCode,
  Vec3,
  CCFloat,
  CCInteger,
  Animation,
  Collider2D,
} from "cc";
import { GameManager } from "../GameManager";

const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40;
@ccclass("playerCtrl")
export class playerCtrl extends Component {
  private _accLeft = false;
  private _accRight = false;
  private _accUp = false;
  private _accDown = false;
  private _xSpeed = 0;
  private _ySpeed = 0;
  private _curPos: Vec3 = new Vec3();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _setBomb: boolean = false;
  private _curBomb: number = 0;
  private _isHit: boolean = false;
  private _animationComp: Animation | null;

  @property({ type: CCFloat })
  accel: number = 80;
  @property({ type: CCFloat })
  maxMoveSpeed = 900;
  @property({ type: CCInteger })
  bombInterval = 1000;
  @property({ type: CCInteger })
  maxBombNumber = 1;
  @property({ type: GameManager })
  gameManager: GameManager | null = null;

  protected onLoad(): void {
    input.on(Input.EventType.KEY_DOWN, this.keyDown, this);
    input.on(Input.EventType.KEY_UP, this.keyUp, this);
    this._animationComp = this.node.getComponent(Animation);
  }

  start() {}

  update(deltaTime: number) {
    this.playerMove(deltaTime);
  }

  private keyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.ARROW_RIGHT:
        this._accRight = true;
        break;

      case KeyCode.ARROW_DOWN:
        this._accDown = true;
        break;

      case KeyCode.ARROW_LEFT:
        this._accLeft = true;
        break;

      case KeyCode.ARROW_UP:
        this._accUp = true;
        break;
    }
  }
  private keyUp(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.ARROW_RIGHT:
        this._accRight = false;
        this._xSpeed = 0;
        if (!this._isHit) this._animationComp.play("player_idle_right");
        break;

      case KeyCode.ARROW_DOWN:
        this._accDown = false;
        this._ySpeed = 0;
        if (!this._isHit) this._animationComp.play("player_idle");
        break;

      case KeyCode.ARROW_LEFT:
        this._accLeft = false;
        this._xSpeed = 0;
        if (!this._isHit) this._animationComp.play("player_idle_left");
        break;

      case KeyCode.ARROW_UP:
        this._accUp = false;
        this._ySpeed = 0;
        if (!this._isHit) this._animationComp.play("player_idle_back");
        break;
      case KeyCode.SPACE:
        this.placeBomb();
        break;
      case KeyCode.KEY_Z:
        this._isHit = false;
        if (!this._isHit) this._animationComp.play("player_idle");
        break;
    }
  }
  private playerMove(deltaTime: number) {
    this.node.getPosition(this._curPos);

    let moveSpeed = this._isHit ? 100 : this.maxMoveSpeed;
    let accel = this._isHit ? 10 : this.accel;
    if (this._accLeft) {
      this._ySpeed = 0;
      this._xSpeed = -accel * deltaTime;
    } else if (this._accRight) {
      this._ySpeed = 0;
      this._xSpeed = accel * deltaTime;
    } else if (this._accUp) {
      this._xSpeed = 0;
      this._ySpeed = accel * deltaTime;
    } else if (this._accDown) {
      this._xSpeed = 0;
      this._ySpeed = -accel * deltaTime;
    }

    if (Math.abs(this._xSpeed) > moveSpeed) {
      this._xSpeed = (moveSpeed * this._xSpeed) / Math.abs(this._xSpeed);
    }
    if (Math.abs(this._ySpeed) > moveSpeed) {
      this._xSpeed =
        (this.maxMoveSpeed * this._ySpeed) / Math.abs(this._ySpeed);
    }
    this._deltaPos.x = this._xSpeed * BLOCK_SIZE * deltaTime;
    this._deltaPos.y = this._ySpeed * BLOCK_SIZE * deltaTime;
    Vec3.add(this._curPos, this._curPos, this._deltaPos);
    this.node.setPosition(this._curPos);

    if (!this._animationComp || this._isHit) return;

    if (
      this._xSpeed < 0 &&
      !this._animationComp.getState("player_walk_left").isPlaying
    ) {
      this._animationComp.play("player_walk_left");
    }
    if (
      this._xSpeed > 0 &&
      !this._animationComp.getState("player_walk_right").isPlaying
    ) {
      this._animationComp.play("player_walk_right");
    }
    if (
      this._ySpeed > 0 &&
      !this._animationComp.getState("player_walk_back").isPlaying
    ) {
      this._animationComp.play("player_walk_back");
    }
    if (
      this._ySpeed < 0 &&
      !this._animationComp.getState("player_walk").isPlaying
    ) {
      this._animationComp.play("player_walk");
    }
  }
  private placeBomb() {
    if (this._setBomb || this._isHit) return;
    this._setBomb = true;
    if (this._curBomb < this.maxBombNumber) {
      const spawnPos = this._curPos;
      let deltaPos = new Vec3(0, 0, 0);
      const bombPos = BLOCK_SIZE;
      if (this._xSpeed > 0) deltaPos.set(-bombPos + 10, 30, 0);
      if (this._xSpeed < 0) deltaPos.set(bombPos + 20, 30, 0);
      if (this._ySpeed > 0) deltaPos.set(0, -bombPos + 20, 0);
      if (this._ySpeed < 0) deltaPos.set(0, bombPos + 30, 0);
      this.gameManager.spawnBomb(spawnPos.add(deltaPos));
      //   this._curBomb++;
    }

    setTimeout(() => {
      this._setBomb = false;
    }, this.bombInterval);
  }

  onBeingHit() {
    this._isHit = true;
    this._animationComp.play("player_in_bubble");
  }
  getSpeeds() {
    return { xSpeed: this._xSpeed, ySpeed: this._ySpeed };
  }
}
