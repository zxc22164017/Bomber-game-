import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
  PolygonCollider2D,
  UITransform,
} from "cc";
import { BLOCK_SIZE, playerCtrl } from "../Player/playerCtrl";
const { ccclass, property } = _decorator;

export const MAX_EXPLODE_RADIUS = 10;
export const EXPLOSION_EXPAND_SPEED = 0.5;

@ccclass("Explosion")
export class Explosion extends Component {
  start() {
    const colliders = this.getComponentsInChildren(BoxCollider2D);
    colliders.forEach((collider) => {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    });
    this.expandRaduis(colliders);
    setTimeout(() => {
      this.node.destroy();
    }, 500);
  }

  update(deltaTime: number) {}

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.node.name === "Body") {
      const player = otherCollider.node.getComponent(playerCtrl);
      if (player) {
        player.onBeingHit();
      }
    }
  }

  private expandRaduis(colliders: BoxCollider2D[]) {
    const vertical = this.node
      .getChildByName("verticle")
      .getComponent(UITransform);
    const horizontal = this.node
      .getChildByName("horizontal")
      .getComponent(UITransform);

    let currentRaduis = 0;
    setInterval(() => {
      if (currentRaduis < MAX_EXPLODE_RADIUS) {
        currentRaduis++;
        vertical.height += EXPLOSION_EXPAND_SPEED;
        horizontal.width += EXPLOSION_EXPAND_SPEED;
        colliders[0].size.height = vertical.height;
        colliders[1].size.width = horizontal.width;
        colliders[0].apply();
        colliders[1].apply();
      }
    }, 10);
  }
}
