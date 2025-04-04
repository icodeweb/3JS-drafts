// Import core Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// THREE needs 3 core components: scene, camera, renderer

// 1. Create a scene — this is where everything lives (objects, lights, etc.) 
const scene = new THREE.Scene();

// 2. Create a camera — defines what we're looking at and how
// PerspectiveCamera(fov, aspect, near, far)
// fov: field of view in degrees
// aspect: width/height ratio of the screen
// near: how close something can be to be visible
// far: how far something can be to still be visible
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// 3. Create a renderer — this draws everything on the screen using WebGL
const renderer = new THREE.WebGLRenderer();

// 4. Set the size of the renderer to full window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // enable shadows

// 5. Add the renderer’s canvas element to the HTML page 
document.body.appendChild(renderer.domElement);


// 6. Add orbit controls — lets us rotate/zoom/pan the camera with the mouse
const controls = new OrbitControls(camera, renderer.domElement);

// Optional: enable smooth motion when rotating (inertia) like decay
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft global light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/src/textures/brick.jpg');

// === OBJECTS ===
// Create a green cube and add it to the scene

// Define the cube's shape (1x1x1 box)
const geometry = new THREE.BoxGeometry();
// const geometry = new THREE.SphereGeometry();

// Define how the cube looks (green color)
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });  // old material
// Create textured cube
const material = new THREE.MeshStandardMaterial({ map: texture });
// Combine shape and material into a mesh (actual object)
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
cube.castShadow = true;

// Add the cube to the scene
scene.add(cube);

// Create floor
const floorGeo = new THREE.PlaneGeometry(10, 10);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Camera position
camera.position.set(3, 2, 5);

// Background color
scene.background = new THREE.Color(0xaaddff); // light blue


// Move the camera away from the cube so we can see it
// camera.position.z = 2; // old
// === ANIMATION LOOP ===
// This function keeps running and updates the scene every frame
function animate() {
    requestAnimationFrame(animate); // call this function again on the next frame

    // Rotate the cube a bit every frame
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    controls.update(); // update camera controls (needed if damping is enabled)

    // Render the current state of the scene from the camera's point of view
    renderer.render(scene, camera);

}
animate();