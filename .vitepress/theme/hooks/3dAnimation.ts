import '@babylonjs/loaders/glTF';

import type { ArcRotateCamera } from '@babylonjs/core';
import { Color4, CubeTexture, Engine, Scene, SceneLoader, Vector3 } from '@babylonjs/core';

const engines: Record<string, Engine> = {};

export const FILE_NAME = 'coin'; //communicator
export const FILE_ZOOM = 2.5; //0.2

export const use3dAnimation = () => {
  async function render(fileName: string, radius = 0): Promise<HTMLCanvasElement> {
    dispose(fileName);

    const canvas = document.createElement('canvas');
    const engine = new Engine(canvas, true, {}, true);

    engines[fileName] = engine;

    engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.createDefaultCameraOrLight(true, true, true);

    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      `/media/${fileName}.env`,
      scene
    );

    SceneLoader.ShowLoadingScreen = false;
    await SceneLoader.AppendAsync('/media/', `${fileName}.glb`, scene);

    const activeCamera = scene.activeCamera as ArcRotateCamera;

    // Вычисляем границы всех загруженных mesh'ей
    const meshes = scene.meshes.filter(mesh => mesh.name !== 'Plane' && mesh.id !== scene.activeCamera?.id);
    if (meshes.length > 0 && meshes[0]) {
      const boundingInfo = meshes[0].getHierarchyBoundingVectors(true);
      const center: Vector3 = Vector3.Center(boundingInfo.min, boundingInfo.max);

      // Центрируем камеру на объект
      activeCamera.target = center;
    }

    activeCamera.alpha += Math.PI;
    activeCamera.radius = radius;
    activeCamera.lowerRadiusLimit = activeCamera.upperRadiusLimit = activeCamera.radius;
    activeCamera.panningSensibility = 0;

    engine.runRenderLoop(() => {
      scene.render();
    });

    return canvas;
  }

  function dispose(fileName: string): void {
    const engine = engines[fileName];

    if (engine) {
      engine.stopRenderLoop();
      engine.dispose();

      delete engines[fileName];
    }
  }

  function resize(fileName: string): void {
    engines[fileName]?.resize();
  }

  async function renderCoin(): Promise<HTMLCanvasElement> {
    return render(FILE_NAME, FILE_ZOOM);
  }

  return {
    render,
    dispose,
    resize,
    renderCoin
  };
};
