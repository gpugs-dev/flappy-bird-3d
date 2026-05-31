import * as THREE from 'three';

export class Bird {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.velocity = 0;
    this.gravity = -30;
    this.flapSpeed = 8;
    this.flapPhase = 0;
    this.deathTime = -1;
    this.materials = [];

    const data = game.assets.models['bird.glb'];
    this.group = new THREE.Group();
    this.group.position.set(-5, 0, 0);
    this.scene.add(this.group);

    this.model = data.scene.clone(true);
    this.model.rotation.y = Math.PI / 2;
    this.model.scale.setScalar(0.25);
    this.model.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
    this.group.add(this.model);

    this.model.traverse((child) => {
      if (child.isMesh && child.material) {
        this.materials.push(child.material);
      }
    });
    this.origColors = this.materials.map((m) => m.color.getHex());
  }

  flap() {
    this.velocity = this.flapSpeed;
    this.flapPhase = 1;
  }

  die() {
    this.deathTime = this.game.sceneSetup.clock.elapsedTime;
  }

  deathUpdate(delta) {
    const elapsed = this.game.sceneSetup.clock.elapsedTime - this.deathTime;
    const t = Math.min(elapsed / 0.5, 1);
    this.materials.forEach((m, i) => {
      m.color.lerpColors(
        new THREE.Color(this.origColors[i]),
        new THREE.Color(0x000000),
        t
      );
    });
  }

  reset() {
    this.velocity = 0;
    this.flapPhase = 0;
    this.deathTime = -1;
    this.group.position.set(-5, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.materials.forEach((m, i) => {
      m.color.setHex(this.origColors[i]);
    });
  }

  idle(delta) {
    this.group.position.y = Math.sin(Date.now() * 0.003) * 0.5;
    this.group.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
  }

  update(delta) {
    this.velocity += this.gravity * delta;
    this.group.position.y += this.velocity * delta;

    const tilt = Math.max(-0.5, Math.min(1.2, this.velocity * 0.04));
    this.group.rotation.z = tilt;

    if (this.flapPhase > 0) {
      this.flapPhase -= delta * 6;
      this.group.rotation.x = -Math.sin(this.flapPhase * Math.PI) * 0.3;
    }

    if (this.group.position.y < -3.3) {
      this.game.gameOver();
    }
  }

  getBounds() {
    const box = new THREE.Box3().setFromObject(this.group);
    return box;
  }
}
