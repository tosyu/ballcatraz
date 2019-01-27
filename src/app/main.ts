import 'p2';
import 'pixi';
import 'phaser';

import '../sass/main.scss';

import { BootState, GameState } from './states';

const WIDTH = 320;
const HEIGHT = 240;

class Ballcatraz{
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

    this.game.state.add('boot', new BootState());
    this.game.state.add('game', new GameState());

    this.game.state.start('boot');
  }
}

(function start() {
  const main = new Ballcatraz();
}());
