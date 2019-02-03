export enum BlockTypes {
  NORMAL = 1,
  GLASS = 2,
  WOOD = 3,
  CONCRETE = 4,
  STEEL = 5,
}

export interface IBlockObject extends Phaser.Graphics {
  hit(what?: Phaser.Physics.Arcade.Body): void;
  isDead(): boolean;
  destroy(): any;
}
