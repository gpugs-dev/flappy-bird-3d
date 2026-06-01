import * as THREE from 'three';

const DECOR_NAMES = ['decor.glb', 'coin.glb', 'cloud.glb', 'mountain.glb', 'bush.glb', 'gem.glb'];
const DECOR_SCALES = { 'decor.glb': 2, 'coin.glb': 3, 'cloud.glb': 4, 'mountain.glb': 3, 'bush.glb': 3, 'gem.glb': 3 };

export class Decor {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.items = [];
    this.speed = -4;
    this.spawnTimer = 0;

    this.templates = DECOR_NAMES.map((name) => {
      const data = game.assets.models[name];
      if (!data) return null;
      const t = data.scene.clone(true);
      t.scale.setScalar(DECOR_SCALES[name]);
      return t;
    }).filter(Boolean);
  }

  update(delta) {
    this.spawnTimer += delta;
    if (this.spawnTimer > 3 + Math.random() * 3) {
      this.spawnTimer = 0;
      this.spawn();
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.position.x += this.speed * delta;
      if (item.position.x < -30) {
        this.scene.remove(item);
        this.items.splice(i, 1);
      }
    }
  }

  spawn() {
    const tpl = this.templates[Math.floor(Math.random() * this.templates.length)];
    const clone = tpl.clone(true);
    clone.position.set(
      30,
      2 + Math.random() * 8,
      -5 - Math.random() * 8
    );
    this.scene.add(clone);
    this.items.push(clone);
  }
}
