import * as THREE from 'three';

export class Pipes {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.pipes = [];
    this.spawnTimer = 0;
    this.spawnInterval = 2;
    this.speed = -8;
    this.gapSize = 4;
    this.pipeWidth = 2;
    this.passedX = -5;

    this.template = game.assets.models['pipe.glb'].scene.clone(true);
  }

  reset() {
    this.pipes.forEach((p) => this.scene.remove(p.group));
    this.pipes = [];
    this.spawnTimer = 0;
  }

  update(delta) {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawn();
    }

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.group.position.x += this.speed * delta;

      if (!p.scored && p.group.position.x < this.passedX) {
        p.scored = true;
        this.game.addScore();
      }

      if (p.group.position.x < -20) {
        this.scene.remove(p.group);
        this.pipes.splice(i, 1);
        this.disposeGroup(p.group);
      }
    }

    this.checkCollision();
  }

  spawn() {
    const gapY = (Math.random() - 0.5) * 6;
    const group = new THREE.Group();

    const top = this.template.clone(true);
    top.position.set(0, gapY + this.gapSize / 2 + 5, 0);
    top.rotation.y = Math.PI;
    group.add(top);

    const bottom = this.template.clone(true);
    bottom.position.set(0, gapY - this.gapSize / 2 - 5, 0);
    group.add(bottom);

    group.position.set(15, 0, 0);
    this.scene.add(group);
    this.pipes.push({ group, scored: false, gapY });
  }

  checkCollision() {
    const birdBounds = this.game.bird.getBounds();
    for (const p of this.pipes) {
      const pipeBounds = new THREE.Box3().setFromObject(p.group);
      if (birdBounds.intersectsBox(pipeBounds)) {
        this.game.gameOver();
        return;
      }
    }
  }

  disposeGroup(group) {
    group.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  }
}
