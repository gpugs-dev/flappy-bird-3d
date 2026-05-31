import * as THREE from 'three';

export class Decor {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.items = [];
    this.speed = -4;
    this.spawnTimer = 0;

    const data = game.assets.models['decor.glb'];
    this.template = data.scene.clone(true);
    this.template.scale.setScalar(2);
  }

  update(delta) {
    this.spawnTimer += delta;
    if (this.spawnTimer > 1 + Math.random() * 2) {
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
    const clone = this.template.clone(true);
    clone.position.set(
      30,
      2 + Math.random() * 8,
      -5 - Math.random() * 8
    );
    this.scene.add(clone);
    this.items.push(clone);
  }
}
