import * as THREE from 'three';

export class Ground {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.speed = -8;
    this.segments = [];

    this.geo = new THREE.BoxGeometry(60, 1, 20);
    this.mat = new THREE.MeshStandardMaterial({
      color: 0x4a7c3f,
      roughness: 0.9,
      metalness: 0,
    });

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(this.geo.clone(), this.mat.clone());
      mesh.position.set(i * 40 - 40, -4, 0);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.segments.push(mesh);
    }
  }

  update(delta) {
    for (const seg of this.segments) {
      seg.position.x += this.speed * delta;
      if (seg.position.x < -50) {
        seg.position.x += 80;
      }
    }
  }
}
