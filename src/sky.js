import * as THREE from 'three';

export class Sky {
  constructor(game) {
    this.scene = game.sceneSetup.scene;
    const data = game.assets.models['sky.glb'];
    if (data) {
      this.scene.background = data.scene;
    }
  }
}
