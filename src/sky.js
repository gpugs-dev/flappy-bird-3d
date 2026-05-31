import * as THREE from 'three';

export class Sky {
  constructor(game) {
    this.scene = game.sceneSetup.scene;

    this.scene.background = new THREE.Color(0x87CEEB);

    const data = game.assets.models['sky.glb'];
    if (data) {
      this.dome = data.scene.clone(true);
      this.dome.scale.setScalar(80);
      this.dome.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.material.side = THREE.BackSide;
        }
      });
      this.dome.renderOrder = -2;
      this.scene.add(this.dome);
    }
  }
}
