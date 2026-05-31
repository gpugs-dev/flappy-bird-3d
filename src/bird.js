import * as THREE from 'three';

export class Bird {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.velocity = 0;
    this.gravity = -30;
    this.flapSpeed = 8;

    const data = game.assets.models['bird.glb'];
    this.model = data.scene.clone(true);
    this.model.position.set(-5, 0, 0);
    this.scene.add(this.model);

    this.mixer = new THREE.AnimationMixer(this.model);
    this.animations = {};
    data.animations.forEach((clip) => {
      this.animations[clip.name] = this.mixer.clipAction(clip);
    });

    if (this.animations['Idle']) this.animations['Idle'].play();
  }

  flap() {
    this.velocity = this.flapSpeed;
    if (this.animations['Flap']) {
      this.animations['Flap'].stop();
      this.animations['Flap'].play();
    }
  }

  reset() {
    this.velocity = 0;
    this.model.position.set(-5, 0, 0);
    this.model.rotation.set(0, 0, 0);
  }

  idle(delta) {
    this.mixer.update(delta);
    this.model.position.y = Math.sin(Date.now() * 0.003) * 0.5;
  }

  update(delta) {
    this.mixer.update(delta);
    this.velocity += this.gravity * delta;
    this.model.position.y += this.velocity * delta;

    const tilt = Math.max(-0.5, Math.min(1.2, this.velocity * 0.04));
    this.model.rotation.z = tilt;

    if (this.model.position.y < -8) {
      this.game.gameOver();
    }
  }

  getBounds() {
    const box = new THREE.Box3().setFromObject(this.model);
    return box;
  }
}
