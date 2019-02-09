import 'phaser';

import { IBlockObject, BlockTypes } from './BlockObject.def';
import { NormalBlockObject } from './';
import { GlassBlockObject } from './GlassBlockObject';
import { WoodBlockObject } from './WoodBlockObject';
import { ConcreteBlockObject } from './ConcreteBlockObject';
import { SteelBlockObject } from './SteelBlockObject';
// import './GlassBlock';

export function createBlock(type: BlockTypes, game: Phaser.Game, x: number, y: number)
  : IBlockObject {
  switch (type) {
    case BlockTypes.NORMAL:
    default:
      return new NormalBlockObject(game, x, y);
    case BlockTypes.GLASS:
      return new GlassBlockObject(game, x, y);
    case BlockTypes.WOOD:
      return new WoodBlockObject(game, x, y);
    case BlockTypes.CONCRETE:
      return new ConcreteBlockObject(game, x, y);
    case BlockTypes.STEEL:
      return new SteelBlockObject(game, x, y);
  }
}

export function getObjectType(obj: IBlockObject): BlockTypes {
  switch (true) {
    case obj instanceof NormalBlockObject:
      return BlockTypes.NORMAL;
    case obj instanceof GlassBlockObject:
      return BlockTypes.GLASS;
    case obj instanceof WoodBlockObject:
      return BlockTypes.WOOD;
    case obj instanceof ConcreteBlockObject:
      return BlockTypes.CONCRETE;
    case obj instanceof SteelBlockObject:
      return BlockTypes.STEEL;
  }
}
