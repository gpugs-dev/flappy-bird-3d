import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class AssetLoader {
  constructor() {
    this.loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.loader.setDRACOLoader(draco);

    this.models = {};
  }

  loadAll() {
    const files = ['bird.glb', 'pipe.glb', 'decor.glb'];
    const promises = files.map((name) => this.loadModel(name));
    return Promise.all(promises).then((results) => {
      files.forEach((name, i) => {
        this.models[name] = results[i];
      });
    });
  }

  loadModel(name) {
    return new Promise((resolve, reject) => {
      this.loader.load(`/models/${name}`, resolve, undefined, reject);
    });
  }
}
