// Import core Three.js and OrbitControls
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// THREE needs 3 core components: scene, camera, renderer

// 1. Create a scene — this is where everything lives (objects, lights, etc.) 
const scene = new THREE.Scene();

// 2. Create a camera — defines what we're looking at and how
// PerspectiveCamera(fov, aspect, near, far)
// fov: field of view in degrees
// aspect: width/height ratio of the screen
// near: how close something can be to be visible
// far: how far something can be to still be visible

const cameraOne = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
cameraOne.position.set(4, 3, -3);

const cameraTwo = new THREE.OrthographicCamera(
    window.innerWidth / -100,
    window.innerWidth / 100,
    window.innerHeight / 100,
    window.innerHeight / -100,
    0.1,
    1000
);
cameraTwo.position.set(0, 10, 0);
cameraTwo.lookAt(0, 0, 0);


let activeCamera = cameraOne;


// 3. Create a renderer — this draws everything on the screen using WebGL
//antialias makes the rendering look cleaner and less pixelated
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 4. Set the size of the renderer to full window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // enable shadows

// 5. Add the renderer’s canvas element to the HTML page 
document.body.appendChild(renderer.domElement);

// 6. Add orbit controls — lets us rotate/zoom/pan the camera with the mouse
const controls = new OrbitControls(activeCamera, renderer.domElement);

// Optional: enable smooth motion when rotating (inertia) like decay
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

// lights lights lights lights lights
// ambientLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft global light
scene.add(ambientLight);

// pointLight
// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.set(5, 5, 5);
// pointLight.castShadow = true;
// scene.add(pointLight);

// DirectionalLight
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(5, 5, 5);
// directionalLight.position.set(5, 10, 7); // new 
DirectionalLight.castShadow = true; // Enable light to cast shadows
scene.add(DirectionalLight);

// // Lighting setup for the shadow thing
// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(2, 2, 5);
// light.castShadow = true; // Enable light to cast shadows
// scene.add(light);
// // Ambient light to light the scene (without casting shadows)
// const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
// scene.add(ambientLight);


// Backgrounds
// Background color
scene.background = new THREE.Color(0x0000ff); // light blue

// Cube Map (6 images for the skybox)
const skyboxLoader = new THREE.CubeTextureLoader();
const WeltraumTexture = skyboxLoader.load([
    'images/skybox/Weltraum/WeltraumR.png', // Right (px)
    'images/skybox/Weltraum/WeltraumL.png', // Left (nx)
    'images/skybox/Weltraum/WeltraumO.png', // Up (py)
    'images/skybox/Weltraum/WeltraumU.png', // Down (ny)
    'images/skybox/Weltraum/Weltraum.png',  // Front (pz)
    'images/skybox/Weltraum/WeltraumH.png'  // Back (nz)
]);
const MilkyWayTexture = skyboxLoader.load([
    'images/skybox/MilkyWay/dark-s_px.jpg', // Right (px)
    'images/skybox/MilkyWay/dark-s_nx.jpg', // Left (nx)
    'images/skybox/MilkyWay/dark-s_py.jpg', // Up (py)
    'images/skybox/MilkyWay/dark-s_ny.jpg', // Down (ny)
    'images/skybox/MilkyWay/dark-s_pz.jpg',  // Front (pz)
    'images/skybox/MilkyWay/dark-s_nz.jpg'  // Back (nz)
]);
const parkTexture = skyboxLoader.load([
    'images/skybox/park/posx.jpg', // Right (px)
    'images/skybox/park/negx.jpg', // Left (nx)
    'images/skybox/park/posy.jpg', // Up (py)
    'images/skybox/park/negy.jpg', // Down (ny)
    'images/skybox/park/posz.jpg',  // Front (pz)
    'images/skybox/park/negz.jpg'  // Back (nz)
]);

// Set the background of the scene to the cube map
scene.background = WeltraumTexture; // Apply the cube map as the background

// Cube setup with PBR material
// Define the cube's shape (1x1x1 box)
const cubeGeometry = new THREE.BoxGeometry();
// Load extra box texture
const cubeTextureLoader = new THREE.TextureLoader();
const brickTexture = cubeTextureLoader.load('images/textures/brick.jpg');
// materials
// (BasicMaterial) with green color
const cubeBasicmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// (StandardMaterial) textured cube 
const cubeStandardMaterial = new THREE.MeshStandardMaterial({
    // color: 0x0077ff, // Blue 
    // color: 0x00ff00, // green 
    // map: brickTexture, // add Texture
    // reflections require metalness and roughness
    metalness: 1,
    roughness: 0.1,
    envMap: WeltraumTexture, // Apply the Texture that will be shown in reflections .
    wireframe: false,
});
// Combine shape and material into a mesh (actual object)
const cube = new THREE.Mesh(cubeGeometry, cubeStandardMaterial);
cube.castShadow = true; // Enable cube to cast shadows
cube.receiveShadow = true; // Enable cube to receive shadows
// Add the cube to the scene
scene.add(cube);

// shortcut foe making objects (make geometry and material in the mesh itself)
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff5500 })
);
sphere.position.set(2, 0, 0);
scene.add(sphere);


// Create floor
// 
const floorGeo = new THREE.PlaneGeometry(10, 10);
// const floorMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
// basic material is kinda just color .
const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffff,
    metalness: 1,
    roughness: 0.1,
    envMap: WeltraumTexture, // Apply the Texture that will be shown in reflections .
    wireframe: false,
});
// standerd material is kinda reaialistic (light and shadows visable).
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.castShadow = true;
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1
scene.add(floor);


// Floor setup (for shadow receiving)
// this is shadow-receiving plane (to see the shadow).
// this is like floor but it has difreent material that is just shadow
// we can use this and set the floor to receiveShadow = false;
const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -0.9;
plane.receiveShadow = true;
scene.add(plane);





// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


let geometryArray = ["BoxGeometry", "SphereGeometry", "PlaneGeometry", "CircleGeometry", "ConeGeometry", "CylinderGeometry", "RingGeometry", "TorusGeometry", "TorusKnotGeometry", "DodecahedronGeometry", "IcosahedronGeometry", "OctahedronGeometry", "TetrahedronGeometry", "CapsuleGeometry", "LatheGeometry", "TubeGeometry", "ShapeGeometry", "ExtrudeGeometry", "RoundedBoxGeometry"];
// Event: Mouse click
window.addEventListener('click', (event) => {
    // Convert mouse pos to -1 to 1 (WebGL coords)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Find intersected objects
    raycaster.setFromCamera(mouse, activeCamera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Change color of first hit object
        const obj = intersects[0].object;
        let newGeometryName = geometryArray[Math.floor(Math.random() * geometryArray.length)];

        obj.geometry.dispose(); // Optional but good to avoid memory leaks
        obj.geometry = new THREE[newGeometryName](); // Adjust parameters as needed
        console.log(obj);

        // obj.material.color.set(Math.random() * 0xffffff);
        // is wireframe?
        // obj.material.wireframe = true;
    }
});

// Event: Keyboard arrows to move cube
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') cube.position.x -= 0.2;
    if (e.key === 'ArrowRight') cube.position.x += 0.2;
    if (e.key === 'ArrowUp') cube.position.z -= 0.2;
    if (e.key === 'ArrowDown') cube.position.z += 0.2;
});

// Create lil-gui for controls
const gui = new GUI();

// Create control parameters
const cubeProperties = {
    rotationX: 0.01,
    rotationY: 0.01,
    rotationZ: 0.01,
    scale: 1,
    color: cube.material.color.getHex()
};

console.log(activeCamera);

const cameraProperties = {
    positionX: 4,
    positionY: 3,
    positionZ: -3,
    fov: 75,
    far: 1000,
    near: 0.1,
    focus: 10,
    quaternionW: 0.44721359549995815,
    quaternionX: -1.3691967456605072e-17,
    quaternionY: 0.8944271909999157,
    quaternionZ: 2.7383934913210134e-17,
    receiveShadow: true,
    rotationX: -3.1,
    rotationY: 0.9,
    rotationZ: 3.1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    zoom: 1,
}

// Add controls to the GUI
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(cubeProperties, 'rotationX', 0, 0.5, 0.1).name('Rotation X');
cubeFolder.add(cubeProperties, 'rotationY', 0, 0.5, 0.1).name('Rotation Y');
cubeFolder.add(cubeProperties, 'rotationZ', 0, 1, 0.1).name('Rotation Z');
cubeFolder.add(cubeProperties, 'scale', 0.1, 3).name('Scale').onChange((value) => {
    cube.scale.set(value, value, value);
});
cubeFolder.addColor(cubeProperties, 'color').name('Color').onChange((value) => {
    cube.material.color.set(value);
});
cubeFolder.close();
// gui.close();

const sphereFolder = gui.addFolder('Sphere');
sphereFolder.add(sphere.position, 'x', -5, 5).name('position X');
sphereFolder.add(sphere.position, 'y', -5, 5).name('position Y');
sphereFolder.add(sphere.rotation, 'y', 0, Math.PI * 2).name('rotation Y');
sphereFolder.close();

const cameraFolder = gui.addFolder('Camera')
// Position
cameraFolder.add(cameraProperties, 'positionX', -10, 10).onChange((v) => activeCamera.position.x = v)
cameraFolder.add(cameraProperties, 'positionY', -10, 10).onChange((v) => activeCamera.position.y = v)
cameraFolder.add(cameraProperties, 'positionZ', -10, 10).onChange((v) => activeCamera.position.z = v)
// Rotation
cameraFolder.add(cameraProperties, 'rotationX', -Math.PI, Math.PI).onChange((v) => activeCamera.rotation.x = v)
cameraFolder.add(cameraProperties, 'rotationY', -Math.PI, Math.PI).onChange((v) => activeCamera.rotation.y = v)
cameraFolder.add(cameraProperties, 'rotationZ', -Math.PI, Math.PI).onChange((v) => activeCamera.rotation.z = v)
// FOV, near, far
cameraFolder.add(cameraProperties, 'fov', 1, 180).onChange((v) => {
    activeCamera.fov = v
    activeCamera.updateProjectionMatrix()
})
cameraFolder.add(cameraProperties, 'near', 0.01, 10).onChange((v) => {
    activeCamera.near = v
    activeCamera.updateProjectionMatrix()
})
cameraFolder.add(cameraProperties, 'far', 10, 2000).onChange((v) => {
    activeCamera.far = v
    activeCamera.updateProjectionMatrix()
})
// Zoom
cameraFolder.add(cameraProperties, 'zoom', 0.1, 5).onChange((v) => {
    activeCamera.zoom = v
    activeCamera.updateProjectionMatrix()
})
// Scale (if camera object has .scale property, usually not used on cameras)
cameraFolder.add(cameraProperties, 'scaleX', 0.1, 10).onChange((v) => activeCamera.scale.x = v)
cameraFolder.add(cameraProperties, 'scaleY', 0.1, 10).onChange((v) => activeCamera.scale.y = v)
cameraFolder.add(cameraProperties, 'scaleZ', 0.1, 10).onChange((v) => activeCamera.scale.z = v)

cameraFolder.close();

const cameraOptions = { camera: 'Perspective' };
gui.add(cameraOptions, 'camera', ['Perspective', 'Orthographic']).onChange((value) => {
    activeCamera = value === 'Perspective' ? cameraOne : cameraTwo;
});

// === ANIMATION LOOP ===
// This function keeps running and updates the scene every frame
function animate(time) {
    requestAnimationFrame(animate); // call this function again on the next frame
    const t = time * 0.001; // convert to seconds
    // console.log(t);
    sphere.position.y = Math.sin(t) * 0.5;
    sphere.rotation.y = Math.sin(t) * 0.5;
    // Rotate the cube a bit every frame
    // cube.rotation.x += sceneProperties.rotationX; // use if useing sceneProperties
    // cube.rotation.y += sceneProperties.rotationY; // use if useing sceneProperties
    cube.rotation.x += cubeProperties.rotationX;
    cube.rotation.y += cubeProperties.rotationY;
    cube.rotation.z += cubeProperties.rotationZ;
    controls.update(); // update camera controls (needed if damping is enabled)
    activeCamera.position.x += .001
    activeCamera.position.y += .001
    activeCamera.position.z += .001

    // Render the current state of the scene from the camera's point of view
    renderer.render(scene, activeCamera);


}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// end of code 







// extras

// this changes the Properties for all scene childrens not just the cube
// // lil-gui for controls
// const gui = new GUI();
// const sceneProperties = {
//     rotationX: 0.01,
//     rotationY: 0.01,
//     scale: 1,
//     color: 0xffffff,
// };

// // Add controls to the GUI
// gui.add(sceneProperties, 'rotationX', 0, 0.1).name('Rotation X');
// gui.add(sceneProperties, 'rotationY', 0, 0.1).name('Rotation Y');
// gui.add(sceneProperties, 'scale', 0.1, 3).name('Scale').onChange((value) => {
//     scene.children.forEach(child => {
//         if (child instanceof THREE.Mesh) {
//             child.scale.set(value, value, value);
//         }
//     });
// });
// gui.addColor(sceneProperties, 'color').name('Color').onChange((value) => {
//     scene.children.forEach(child => {
//         if (child instanceof THREE.Mesh) {
//             child.material.color.set(value);
//         }
//     });
// });
// 