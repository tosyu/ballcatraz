import 'phaser';

import { createBlock, PaddleObject, BallObject, IBlockObject } from '../objects';
import { Physics } from 'phaser-ce';

export class GameState extends Phaser.State {

  blocks: Phaser.Group;
  paddle: Phaser.Graphics;
  ball: Phaser.Graphics;

  levelName: string;

  init(levelName: string) {
    this.levelName = levelName;
    this.load.onLoadStart.add(() => console.log('loading'));
    this.load.onLoadComplete.add(() => console.log('loaded'));
  }

  preload() {
    this.load.text(this.levelName, ['/assets/maps', `${this.levelName}.map`].join('/'));
  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    const map: number[] = this.cache.getText(this.levelName)
      .replace(/[^0-9]+/gi, '')
      .split('')
      .map(c => parseFloat(c.trim()));

    this.blocks = this.game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Phaser.Physics.ARCADE;
    let c = 0;
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        if (map[c] > 0) {
          const block = createBlock(map[c], this.game, j * 32, i * 10);

          this.physics.enable(block);
          (block.body as Phaser.Physics.Arcade.Body).immovable = true;

          this.blocks.add(block);
        }
        c += 1;
      }
    }
    this.world.add(this.blocks);

    const centerX = this.game.width / 2;

    this.paddle = this.world.add(new PaddleObject(this.game, centerX - 16, this.game.height - 32));
    this.physics.enable(this.paddle);
    this.paddle.body.immovable = true;

    this.ball = this.world.add(new BallObject(this.game, centerX, this.game.height - 40));
    this.physics.enable(this.ball);

    const ballBody = (this.ball.body as Phaser.Physics.Arcade.Body);
    ballBody.collideWorldBounds = true;
    ballBody.velocity.set(centerX + 5, this.game.height / 2);
    ballBody.bounce.set(1);
  }

  start() {

  }

  update() {
    this.physics.arcade.collide(this.ball, this.paddle);
    this.physics.arcade.collide(this.ball, this.blocks, this.onBallCollide);
  }

  onBallCollide(ball: BallObject, block: IBlockObject) {
    block.hit();
    if (block.isDead()) {
      block.destroy();
    }
  }
}
