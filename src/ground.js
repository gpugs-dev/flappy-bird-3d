import * as THREE from 'three';

export class Ground {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.segments = [];
    this.speed = -8;

    const data = game.assets.models['ground.glb'];
    this.template = data.scene.clone(true);

    const segWidth = 30;
    for (let i = 0; i < 3; i++) {
      const seg = this.template.clone(true);
      seg.position.set(i * segWidth - segWidth, -12, 0);
      seg.traverse((c) => { if (c.isMesh) c.receiveShadow = true; });
      this.scene.add(seg);
      this.segments.push(seg);
    }
  }

  update(delta) {
    for (const seg of this.segments) {
      seg.position.x += this.speed * delta;
      if (seg.position.x < -40) {
        seg.position.x += 60;
      }
    }
  }
}
