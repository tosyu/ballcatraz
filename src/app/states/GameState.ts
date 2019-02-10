import 'phaser';

import {
  createBlock, PaddleObject, BallObject, IBlockObject, getObjectType,
  BlockTypes } from '../objects';

const pow = Math.pow;
const max = Math.max;
const min = Math.min;
const abs = Math.abs;

function clamp(v: number, vmin: number, vmax: number): number {
  return min(vmax, max(vmin, v));
}

const DEFAULT_BALL_SPEED = 100;

export class GameState extends Phaser.State {

  blocks: Phaser.Group;
  paddle: PaddleObject;
  ball: BallObject;

  points: number;

  pointsTx: Phaser.BitmapText;
  timeTx: Phaser.BitmapText;
  pauseTx: Phaser.BitmapText;
  startTx: Phaser.BitmapText;

  levelName: string;
  gameStarted: boolean;

  init(levelName: string) {
    this.levelName = levelName;
    this.load.onLoadStart.add(() => console.log('loading'));
    this.load.onLoadComplete.add(() => console.log('loaded'));
  }

  preload() {
    this.load.bitmapFont('dejavu', '/assets/fonts/dejavu.png', '/assets/fonts/dejavu.xml');
    this.load.text(this.levelName, ['/assets/maps', `${this.levelName}.map`].join('/'));
  }

  create() {
    this.gameStarted = false;
    this.game.paused = true;
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
    const centerY = this.game.height / 2;

    this.paddle = this.world.add(new PaddleObject(this.game, centerX - 16, this.game.height - 32));
    this.physics.enable(this.paddle);
    this.paddle.body.immovable = true;

    this.ball = this.world.add(new BallObject(this.game, centerX, this.game.height - 40));
    this.physics.enable(this.ball);

    const ballBody = (this.ball.body as Phaser.Physics.Arcade.Body);
    const ballWidth = this.ball.width;
    ballBody.setCircle(ballWidth / 2, -(ballWidth / 2), -(ballWidth / 2));
    ballBody.allowRotation = false;
    ballBody.collideWorldBounds = true;
    ballBody.velocity.set(1, 1);
    ballBody.velocity.setMagnitude(100);
    ballBody.bounce.set(1);

    ballBody.onWorldBounds = new Phaser.Signal();
    ballBody.onWorldBounds.add(this.onBallCollideWithBounds, this);

    this.points = 0;
    this.pointsTx = this.add.bitmapText(0, 0, 'dejavu', `Points: ${this.points}`, 10);

    this.pauseTx = this.add.bitmapText(centerX - 25, centerY - 5, 'dejavu', 'Game Paused', 10);
    this.pauseTx.visible = false;

    let startTxVal = 'Press S to start';
    let startTxX = centerX - 35;
    if (!this.game.device.desktop) {
      startTxVal = 'Click anywhere to start';
      startTxX = centerX - 50;
    }
    this.startTx = this.add.bitmapText(startTxX, centerY - 5, 'dejavu', startTxVal, 10);

    this.input.keyboard.addCallbacks(this, this.onKeyDown);
    this.input.onUp.add(this.onUp, this);
  }

  shutdown() {
    this.input.keyboard.removeCallbacks();
    this.input.onUp.remove(this.onUp, this);
  }

  render() {
    this.game.debug.body(this.ball);
    this.game.debug.body(this.paddle);
  }

  update() {
    this.physics.arcade.collide(this.ball, this.paddle, this.onBallCollideWithPaddle, null, this);
    this.physics.arcade.collide(this.ball, this.blocks, this.onBallCollideWithBlock, null, this);

    this.pointsTx.setText(`Points: ${this.points}`);

    if (this.pauseTx.visible) {
      this.pauseTx.visible = false;
    }
  }

  private onBallCollideWithBounds(ball: BallObject, up: boolean, down: boolean) {
    if (down) {
      this.state.start('game', true, true, this.levelName);
    }
  }

  pauseUpdate() {
    if (this.gameStarted) {
      this.pauseTx.visible = true;
    }
  }

  private onUp(poibter: Phaser.Pointer) {
    if (!this.game.device.desktop) {
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.game.paused = this.startTx.visible = false;
      } else if (!this.paddle.isDragging()) {
        this.pauseTx.visible = this.game.paused = !this.game.paused;
      }
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.which) {
      case Phaser.KeyCode.S:
        if (!this.gameStarted) {
          this.gameStarted = true;
          this.game.paused = this.startTx.visible = false;
        }
        break;
      case Phaser.KeyCode.P:
        this.pauseTx.visible = this.game.paused = !this.game.paused;
        break;
    }
  }

  private onBallCollideWithPaddle(ball: BallObject, paddle: PaddleObject) {
    // this efectively modifies the direction of the bounce so that is a little more
    // to the side as it approaches the end of the paddle, gives the user more control
    const diff = paddle.centerX + 2 - ball.centerX;
    const amount = (abs(diff) / (paddle.width / 2)) / 0.8;
    const ease = pow(clamp(amount, 0, 1), 2);
    const force = (diff > 0 ? -1 : 1) * ease;

    const velocity = ball.body.velocity;
    const magnitude = velocity.getMagnitude();

    velocity.normalize().add(force, 0);
    this.resetBallSpeed();
  }

  private onBallCollideWithBlock(ball: BallObject, block: IBlockObject) {
    this.resetBallSpeed();
    block.hit();

    let hitPoints = 5;

    if (block.isKillable() && block.isDead()) {
      block.destroy();

      switch (getObjectType(block)) {
        case BlockTypes.NORMAL:
          hitPoints += 10;
          break;
        case BlockTypes.WOOD:
          hitPoints += 25;
          break;
        case BlockTypes.GLASS:
          hitPoints += 50;
          break;
      }
    }

    this.points += hitPoints;
  }

  private resetBallSpeed(speed: number = DEFAULT_BALL_SPEED) {
    this.ball.body.velocity.setMagnitude(DEFAULT_BALL_SPEED);
  }
}
