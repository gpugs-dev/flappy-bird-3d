import * as THREE from 'three';

export class Bird {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.velocity = 0;
    this.gravity = -30;
    this.flapSpeed = 8;
    this.wingAngle = 0;
    this.flapPhase = 0;

    const data = game.assets.models['bird.glb'];
    this.model = data.scene.clone(true);
    this.model.position.set(-5, 0, 0);
    this.scene.add(this.model);

    this.wingMeshes = [];
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        this.wingMeshes.push(child);
      }
    });
  }

  flap() {
    this.velocity = this.flapSpeed;
    this.flapPhase = 1;
  }

  reset() {
    this.velocity = 0;
    this.flapPhase = 0;
    this.model.position.set(-5, 0, 0);
    this.model.rotation.set(0, 0, 0);
  }

  idle(delta) {
    this.model.position.y = Math.sin(Date.now() * 0.003) * 0.5;
    this.model.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
  }

  update(delta) {
    this.velocity += this.gravity * delta;
    this.model.position.y += this.velocity * delta;

    const tilt = Math.max(-0.5, Math.min(1.2, this.velocity * 0.04));
    this.model.rotation.z = tilt;

    if (this.flapPhase > 0) {
      this.flapPhase -= delta * 6;
      this.model.rotation.x = -Math.sin(this.flapPhase * Math.PI) * 0.3;
    }

    for (const mesh of this.wingMeshes) {
      mesh.rotation.z = Math.sin(Date.now() * 0.01 + mesh.id) * 0.2;
    }

    if (this.model.position.y < -8) {
      this.game.gameOver();
    }
  }

  getBounds() {
    const box = new THREE.Box3().setFromObject(this.model);
    return box;
  }
}
