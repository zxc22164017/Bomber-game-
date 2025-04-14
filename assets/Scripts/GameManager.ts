import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  bombModal: Prefab | null = null;
  start() {}

  update(deltaTime: number) {}

  public spawnBomb(playerPos: Vec3) {
    let bomb = instantiate(this.bombModal);
    this.node.addChild(bomb);
    bomb.setPosition(playerPos);
  }
}
