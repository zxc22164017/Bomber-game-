import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Block")
export class Block extends Component {
  start() {
    const collider = this.getComponent(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeingExplode, this);
  }

  update(deltaTime: number) {}

  private onBeingExplode(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log(otherCollider);
  
  }
}
