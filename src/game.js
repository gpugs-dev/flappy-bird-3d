import * as THREE from 'three';
import { SceneSetup } from './scene.js';
import { AssetLoader } from './assets.js';
import { Bird } from './bird.js';
import { Pipes } from './pipes.js';
import { Ground } from './ground.js';
import { Sky } from './sky.js';
import { Decor } from './decor.js';
import { UI } from './ui.js';

const STATE = { MENU: 0, PLAYING: 1, GAME_OVER: 2 };

export class Game {
  constructor() {
    this.state = STATE.MENU;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('flappyBest') || '0', 10);
  }

  async init() {
    this.sceneSetup = new SceneSetup();
    this.ui = new UI(this);
    this.assets = new AssetLoader();

    this.ui.showLoading();
    await this.assets.loadAll();
    this.ui.hideLoading();

    this.bird = new Bird(this);
    this.pipes = new Pipes(this);
    this.ground = new Ground(this);
    this.sky = new Sky(this);
    this.decor = new Decor(this);

    this.ui.showMenu();
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.sceneSetup.clock.getDelta(), 0.05);

    if (this.state === STATE.PLAYING) {
      this.bird.update(delta);
      this.pipes.update(delta);
      this.ground.update(delta);
      this.decor.update(delta);
    } else if (this.state === STATE.MENU) {
      this.bird.idle(delta);
    } else if (this.state === STATE.GAME_OVER) {
      this.bird.deathUpdate(delta);
    }

    this.sceneSetup.renderer.render(this.sceneSetup.scene, this.sceneSetup.camera);
  }

  startGame() {
    this.state = STATE.PLAYING;
    this.score = 0;
    this.ui.hideAll();
    this.pipes.reset();
    this.decor.items.forEach((d) => this.sceneSetup.scene.remove(d.group));
    this.decor.items = [];
    this.decor.spawnTimer = 0;
    this.bird.reset();
    this.ui.updateScore(this.score);
  }

  gameOver() {
    this.state = STATE.GAME_OVER;
    this.bird.die();
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('flappyBest', String(this.bestScore));
    }
    this.ui.showGameOver(this.score, this.bestScore);
  }

  addScore() {
    this.score += 1;
    this.ui.updateScore(this.score);
  }

  onJump() {
    if (this.state === STATE.MENU) {
      this.startGame();
    } else if (this.state === STATE.PLAYING) {
      this.bird.flap();
    } else if (this.state === STATE.GAME_OVER) {
      this.state = STATE.MENU;
      this.ui.showMenu();
    }
  }
}
