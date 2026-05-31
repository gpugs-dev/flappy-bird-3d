import * as THREE from 'three';

export class Pipes {
  constructor(game) {
    this.game = game;
    this.scene = game.sceneSetup.scene;
    this.pipes = [];
    this.spawnTimer = 0;
    this.spawnInterval = 2;
    this.speed = -8;
    this.gapSize = 4.5;
    this.passedX = -5;

    const data = game.assets.models['pipe.glb'];
    this.template = data.scene.clone(true);
    this.template.scale.setScalar(2);
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

    const bottomMesh = this.template.clone(true);
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    bottomMesh.position.set(0, gapY - this.gapSize / 2 - 4, 0);
    group.add(bottomMesh);

    const topMesh = this.template.clone(true);
    topMesh.rotation.x = Math.PI / 2;
    topMesh.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    topMesh.position.set(0, gapY + this.gapSize / 2 + 4, 0);
    group.add(topMesh);

    group.position.set(15, 0, 0);
    this.scene.add(group);
    this.pipes.push({ group, scored: false, gapY });
  }

  checkCollision() {
    const bird = this.game.bird;
    const bx = bird.group.position.x;
    const by = bird.group.position.y;
    const r = 0.15;
    const margin = 0.3;

    for (const p of this.pipes) {
      const px = p.group.position.x;
      const halfGap = this.gapSize / 2;

      const near = 2.5;
      if (bx + r > px - 0.4 && bx - r < px + 0.4) {
        if (by + r > p.gapY + halfGap + margin && by - r < p.gapY + halfGap + near) {
          this.game.gameOver();
          return;
        }
        if (by - r < p.gapY - halfGap - margin && by + r > p.gapY - halfGap - near) {
          this.game.gameOver();
          return;
        }
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
