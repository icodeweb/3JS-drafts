
# Three.js Experiment – Full Breakdown

## 🧭 Table of Contents

- [Scene & Renderer](#scene--renderer)
- [Camera](#camera)
- [Lighting](#lighting)
- [Environment: Skybox](#environment-skybox)
- [Geometry & Material](#geometry--material)
- [GUI Controls (dat.GUI)](#gui-controls-datgui)
- [User Interactions](#user-interactions)
- [Extras Utilities](#extras-utilities)
- [Animation Loop](#animation-loop)
- [Window Resize Handling](#window-resize-handling)
- [Renderer DOM & Start](#renderer--start)

## Scene & Renderer

```js
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

- `scene`: Base container for all objects.
- `WebGLRenderer`: Renders the scene with anti-aliasing.
- Appends canvas to body.

## Camera

```js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);
```

- Perspective view with 75° FOV.
- Positioned above ground and slightly back.

## Lighting

You’ve used **all major light types**. Here’s each one:

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
const spotLight = new THREE.SpotLight(0xffffff);
```

- **AmbientLight**: Soft global lighting.
- **DirectionalLight**: Parallel rays like sunlight.
- **HemisphereLight**: Sky and ground colored lighting.
- **PointLight**: Emits light in all directions from a point.
- **SpotLight**: Focused beam like a flashlight.

All lights are added to the scene:

```js
scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, spotLight);
```

## Environment: Skybox

```js
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "1/px.jpg", "1/nx.jpg",
  "1/py.jpg", "1/ny.jpg",
  "1/pz.jpg", "1/nz.jpg"
]);
scene.background = texture;
```

- Loads a cube map as a 360° skybox.
- 6 directional images make up the cube.

## Geometry & Material

```js
let geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

- Default: green box.
- `MeshStandardMaterial` uses physically correct lighting.

## GUI Controls (dat.GUI)

```js
const gui = new dat.GUI();
const geometryOptions = ["Box", "Sphere", "Plane", "Torus", "TorusKnot"];
gui.add({ geometry: "Box" }, "geometry", geometryOptions).onChange(createGeometry);
```

- Lets you switch between geometry types live.
- Also includes toggles for wireframe, spin, and random position:

```js
gui.add({ wireframe: false }, "wireframe").onChange(value => toggleWireframe(mesh));
gui.add({ spin: () => rotateCurrentMesh("right") }, "spin");
gui.add({ randomize: () => setRandomPosition(mesh) }, "randomize");
```

## User Interactions

#### Mouse click – Rotate Left

```js
window.addEventListener("click", () => {
  rotateCurrentMesh("left");
});
```

#### Keyboard input

```js
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") rotateCurrentMesh("right");
  else if (event.key === "ArrowLeft") rotateCurrentMesh("left");
});
```

## Extras Utilities

#### Geometry Management

```js
function createGeometry(geometryType) {
  const newGeometry = ... // based on type
  replaceGeometry(mesh, newGeometry);
}

function replaceGeometry(mesh, newGeometry) {
  mesh.geometry.dispose();
  mesh.geometry = newGeometry;
}
```

#### Position Randomizer

```js
function setRandomPosition(mesh) {
  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
}
```

#### Rotation Utility

```js
function rotateCurrentMesh(direction) {
  mesh.rotation.y += direction === "left" ? -0.1 : 0.1;
}
```

#### Wireframe Toggle

```js
function toggleWireframe(mesh) {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(mat => mat.wireframe = !mat.wireframe);
  } else {
    mesh.material.wireframe = !mesh.material.wireframe;
  }
}
```

## Animation Loop

```js
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

## Window Resize Handling

```js
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

- Keeps the canvas full screen and responsive.

## Renderer & Start

```js
document.body.appendChild(renderer.domElement);
```

- Adds canvas to body so it's visible.
- This was done early in the script.
