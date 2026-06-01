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
      return { name, scene: data.scene.clone(true) };
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
      item.group.position.x += this.speed * delta;

      if (item.type === 'coin.glb' || item.type === 'gem.glb') {
        item.group.rotation.y += delta * 2;
      }
      if (item.type === 'decor.glb') {
        item.group.rotation.y += delta * 1.5;
        const s = 1 + Math.sin(Date.now() * 0.003 + i) * 0.15;
        item.group.scale.setScalar(s * DECOR_SCALES[item.type]);
      }
      if (item.type === 'cloud.glb') {
        item.group.position.y += Math.sin(Date.now() * 0.002 + i) * delta * 0.3;
      }

      if (item.group.position.x < -30) {
        this.scene.remove(item.group);
        this.items.splice(i, 1);
      }
    }
  }

  spawn() {
    const tpl = this.templates[Math.floor(Math.random() * this.templates.length)];
    const clone = tpl.scene.clone(true);
    const group = new THREE.Group();
    group.add(clone);
    group.scale.setScalar(DECOR_SCALES[tpl.name]);
    group.position.set(
      30,
      2 + Math.random() * 8,
      -5 - Math.random() * 8
    );
    this.scene.add(group);
    this.items.push({ group, type: tpl.name });
  }
}
