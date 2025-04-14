import {
  _decorator,
  CCInteger,
  Component,
  Prefab,
  instantiate,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  RigidBody2D,
  Vec2,
  director,
  Director,
  Animation,
} from "cc";
import { playerCtrl } from "../Player/playerCtrl";
const { ccclass, property } = _decorator;
const KICKFORCE = 4;

@ccclass("bomb")
export class bomb extends Component {
  private isExplode = false;
  private kickedCount = 0;

  @property({ type: CCInteger })
  explodeTime = 500;
  @property({ type: playerCtrl })
  player: playerCtrl | null = null;
  @property({ type: Prefab })
  explosionModal: Prefab | null = null;

  start() {
    const animation = this.node.getComponentInChildren(Animation);
    let collider = this.getComponentInChildren(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeingKicked, this);
    animation.on(Animation.EventType.FINISHED, this.explode, this);
  }

  update(deltaTime: number) {}

  private explode() {
    this.isExplode = true;

    const rigidBody = this.getComponentInChildren(RigidBody2D);

    rigidBody.linearVelocity = Vec2.ZERO;
    let explosion = instantiate(this.explosionModal);
    this.node.parent.addChild(explosion);
    explosion.setWorldPosition(rigidBody.node.worldPosition);
    setTimeout(() => {
      this.isExplode = false;
      this.node.destroy();
    }, 50);
  }
  protected onDestroy(): void {}

  private onBeingKicked(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.node.name === "Body") {
      this.kickedCount++;
      if (this.kickedCount > 1) {
        const rigidBody = this.getComponentInChildren(RigidBody2D);
        const contactInfo = contact.getWorldManifold();
        const { xSpeed, ySpeed } = otherCollider.node
          .getParent()
          .getComponent(playerCtrl)
          .getSpeeds();
        rigidBody.applyLinearImpulse(
          new Vec2(xSpeed * KICKFORCE, ySpeed * KICKFORCE),
          contactInfo.points[0],
          true
        );
      }
    }
  }
}
