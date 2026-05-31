import * as THREE from 'three';

export class Decor {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.items = [];
    this.speed = -6;
    this.spawnTimer = 0;

    const data = game.assets.models['decor.glb'];
    this.template = data.scene.clone(true);
    this.template.scale.setScalar(15);
  }

  update(delta) {
    this.spawnTimer += delta;
    if (this.spawnTimer > 2 + Math.random() * 3) {
      this.spawnTimer = 0;
      this.spawn();
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.position.x += this.speed * delta;
      if (item.position.x < -25) {
        this.scene.remove(item);
        this.items.splice(i, 1);
      }
    }
  }

  spawn() {
    const clone = this.template.clone(true);
    clone.position.set(
      25,
      1 + Math.random() * 4,
      (Math.random() - 0.5) * 16
    );
    this.scene.add(clone);
    this.items.push(clone);
  }
}
