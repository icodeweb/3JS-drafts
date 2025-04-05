# Ibrahim’s All-in-One Three.js Playground (Full Breakdown)

This document explains everything in your Three.js test file step-by-step.

---

## 📦 Setup

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
```

- **THREE**: Core Three.js library.
- **OrbitControls**: Lets the user rotate, pan, and zoom the scene using mouse.
- **GUI**: Adds a control panel to modify values live.

---

## 🎬 Scene, Camera, Renderer

```js
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath('cubemaps/skybox/').load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);
```

- **Scene**: Container for everything.
- **CubeTextureLoader**: Loads 6 images to make a skybox background (px = positive X, nx = negative X, etc.).

```js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```

- **PerspectiveCamera**: Mimics a real-world camera.
- FOV: 75 degrees, aspect ratio, near/far clipping planes.

```js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

- **Renderer**: Renders the scene to canvas. Appended to the document.

---

## ✨ Lights

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
```

- **AmbientLight**: Lights everything evenly.

```js
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
```

- **PointLight**: Emits light in all directions from a point.

```js
const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
```

- **DirectionalLight**: Like sunlight — parallel rays.

```js
const spotLight = new THREE.SpotLight(0x0000ff, 1);
spotLight.position.set(-5, 5, 5);
scene.add(spotLight);
```

- **SpotLight**: Focused light like a flashlight.

```js
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);
```

- **HemisphereLight**: Light from sky and ground colors.

```js
const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
rectLight.position.set(0, 5, 0);
scene.add(rectLight);
```

- **RectAreaLight**: Emits light from a rectangular area.

> 💡 RectAreaLight only works with **MeshStandardMaterial** or **MeshPhysicalMaterial** and requires a special RectAreaLightUniformsLib to work properly (you may need to import and initialize it separately).

---

## 🧱 Geometries & Materials

```js
const geometries = {
  box: new THREE.BoxGeometry(),
  sphere: new THREE.SphereGeometry(),
  cone: new THREE.ConeGeometry(1, 2, 32),
  torus: new THREE.TorusGeometry(1, 0.4, 16, 100),
  cylinder: new THREE.CylinderGeometry(1, 1, 2, 32),
};
```

```js
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
let mesh = new THREE.Mesh(geometries.box, material);
scene.add(mesh);
```

- Using **MeshStandardMaterial** to reflect lights properly.

---

## 🎛 GUI Controls

```js
const gui = new GUI();
const params = {
  geometry: 'box',
  color: '#0077ff',
};
```

```js
gui.add(params, 'geometry', Object.keys(geometries)).onChange((value) => {
  scene.remove(mesh);
  mesh.geometry.dispose();
  mesh = new THREE.Mesh(geometries[value], material);
  scene.add(mesh);
});

gui.addColor(params, 'color').onChange((value) => {
  material.color.set(value);
});
```

- Allows live switching between geometries.
- Color picker updates mesh material.

---

## 🧭 Orbit Controls

```js
const controls = new OrbitControls(camera, renderer.domElement);
```

- Mouse drag and zoom functionality.

---

## 🧠 Interaction (Keyboard)

```js
window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case '1':
      scene.background = null;
      break;
    case '2':
      scene.background = new THREE.Color(0x333333);
      break;
    case '3':
      scene.background = new THREE.CubeTextureLoader().setPath('cubemaps/skybox/').load([
        'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
      ]);
      break;
  }
});
```

- Press:
  - `1` to remove background
  - `2` for solid color background
  - `3` to re-enable skybox

---

## 🌀 Animation Loop

```js
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

- Rotates the mesh continuously.
- Re-renders every frame.

---

## ✅ Summary Checklist

- [x] Scene, camera, renderer
- [x] Skybox (CubeTextureLoader)
- [x] All lights: ambient, point, directional, spot, hemisphere, rect
- [x] OrbitControls
- [x] Switchable geometries
- [x] MeshStandardMaterial
- [x] GUI to change shape and color
- [x] Keyboard controls to change background
- [x] Rotation animation loop

---

Let me know if you want to add shadows, post-processing, loading 3D models, or physics next!
