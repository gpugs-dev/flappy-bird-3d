import * as THREE from 'three';

export class Sky {
  constructor(game) {
    this.scene = game.sceneSetup.scene;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(`${import.meta.env.BASE_URL}models/sky.jpg`);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.scene.background = texture;
  }
}
