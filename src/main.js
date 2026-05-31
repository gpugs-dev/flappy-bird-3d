import * as THREE from 'three';
import { Game } from './game.js';

const game = new Game();
game.init();

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    game.onJump();
  }
});

window.addEventListener('click', () => {
  game.onJump();
});
