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

// lights lights lights lights lights
// ambientLight
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft global light
// scene.add(ambientLight);

// pointLight
// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.set(5, 5, 5);
// pointLight.castShadow = true;
// scene.add(pointLight);

// DirectionalLight
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(5, 5, 5);
scene.add(DirectionalLight);


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
// const floorMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
// basic material is kinda just color .
const floorMat = new THREE.MeshStandardMaterial({ color: 0x8888ff, wireframe: false });
// standerd material is kinda reaialistic (light and shadows visable).
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Camera position
// Move the camera away from the cube so we can see it
// camera.position.z = 2; // old
// camera.position.set(3, 2, 5);
camera.position.set(0, 1, 5);


// Background color
scene.background = new THREE.Color(0x0000ff); // light blue

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event: Mouse click
window.addEventListener('click', (event) => {
    // Convert mouse pos to -1 to 1 (WebGL coords)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Find intersected objects
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Change color of first hit object
        const obj = intersects[0].object;
        console.log(obj);
        if (obj.geometry.type === "BoxGeometry") {
            obj.geometry.dispose(); // Optional but good to avoid memory leaks
            obj.geometry = new THREE.SphereGeometry(1, 320, 32); // Adjust radius and segments
        } else {
            obj.geometry.dispose();
            obj.geometry = new THREE.BoxGeometry();
        }
        obj.material.color.set(Math.random() * 0xffffff);
        console.log(obj.geometry);
    }
});

// Event: Keyboard arrows to move cube
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') cube.position.x -= 0.2;
    if (e.key === 'ArrowRight') cube.position.x += 0.2;
    if (e.key === 'ArrowUp') cube.position.z -= 0.2;
    if (e.key === 'ArrowDown') cube.position.z += 0.2;
});

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