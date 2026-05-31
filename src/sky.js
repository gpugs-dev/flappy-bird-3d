import * as THREE from 'three';

export class Sky {
  constructor(game) {
    this.scene = game.sceneSetup.scene;
    const data = game.assets.models['sky.glb'];
    if (data) {
      this.dome = data.scene.clone(true);
      this.dome.scale.setScalar(200);
      this.dome.position.set(0, 0, 0);
      this.scene.add(this.dome);
    }
  }
}
