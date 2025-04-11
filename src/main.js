// Import core Three.js and OrbitControls
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
// Import GUI for controls
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

// THREE needs 3 core components:
//  scene, camera, renderer
const scene = new THREE.Scene();

const cameraOne = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
cameraOne.position.set(4, 3, -3);

// PerspectiveCamera(fov, aspect, near, far)
// fov: field of view in degrees
// aspect: width/height ratio of the screen
// near: how close something can be to be visible
// far: how far something can be to still be visible

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

const renderer = new THREE.WebGLRenderer({ antialias: true });
//antialias makes the rendering look cleaner and less pixelated

// 4. Set the size of the renderer to full window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // enable shadows

document.body.appendChild(renderer.domElement);

// Add orbit controls — lets us rotate/zoom/pan the camera with the mouse
const controls = new OrbitControls(activeCamera, renderer.domElement);

// enable smooth motion when rotating (inertia) like decay
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

// lights ///////////////////////////////
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft global light
scene.add(ambientLight);

const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(5, 5, 5);
DirectionalLight.castShadow = true; // Enable light to cast shadows
scene.add(DirectionalLight);

// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.set(5, 5, 5);
// pointLight.castShadow = true;
// scene.add(pointLight);


// Backgrounds
scene.background = new THREE.Color(0x0000ff); // light blue
const skyboxLoader = new THREE.CubeTextureLoader();
// skybox : Right(px)  Left(nx   Up(py)  Down(ny)  Front(pz)  Back(nz)
const WeltraumTexture = skyboxLoader.load([
    'images/skybox/Weltraum/WeltraumR.png',
    'images/skybox/Weltraum/WeltraumL.png',
    'images/skybox/Weltraum/WeltraumO.png',
    'images/skybox/Weltraum/WeltraumU.png',
    'images/skybox/Weltraum/Weltraum.png',
    'images/skybox/Weltraum/WeltraumH.png'
]);
const MilkyWayTexture = skyboxLoader.load([
    'images/skybox/MilkyWay/dark-s_px.jpg',
    'images/skybox/MilkyWay/dark-s_nx.jpg',
    'images/skybox/MilkyWay/dark-s_py.jpg',
    'images/skybox/MilkyWay/dark-s_ny.jpg',
    'images/skybox/MilkyWay/dark-s_pz.jpg',
    'images/skybox/MilkyWay/dark-s_nz.jpg'
]);
const parkTexture = skyboxLoader.load([
    'images/skybox/park/posx.jpg',
    'images/skybox/park/negx.jpg',
    'images/skybox/park/posy.jpg',
    'images/skybox/park/negy.jpg',
    'images/skybox/park/posz.jpg',
    'images/skybox/park/negz.jpg'
]);
let selectedTexture = WeltraumTexture;
scene.background = selectedTexture; // Apply the cube map as the background

// objects :mesh(geo, material)
const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
// Load texture
const cubeTextureLoader = new THREE.TextureLoader();
const brickTexture = cubeTextureLoader.load('images/textures/brick.jpg');
// materials
const cubeBasicmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

const cubeStandardMaterial = new THREE.MeshStandardMaterial({
    // color: 0x00ff00,
    // map: brickTexture, // add Texture
    metalness: 1,
    roughness: 0.1,
    envMap: selectedTexture, // Apply the Texture that will be shown in reflections .
    wireframe: false,
    // reflections require metalness and roughness
});
// cubeStandardMaterial.envMap.flipY = true
console.log(cubeStandardMaterial.envMap);
// envMapRotation???
const cube = new THREE.Mesh(cubeGeometry, cubeStandardMaterial);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
        // color: 0xff5500,
        metalness: 1,
        roughness: 0.1,
        envMap: selectedTexture
    })
);
sphere.castShadow = true
sphere.position.set(2, 4, 0);
scene.add(sphere);

// Create floor
const floorGeo = new THREE.PlaneGeometry(10, 10);
const floorMat = new THREE.MeshStandardMaterial({
    // color: 0x582a0e,
    metalness: 1,
    roughness: 0.8,
    envMap: selectedTexture,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.castShadow = true;
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2
scene.add(floor);

// this is shadow-receiving plane.
const planeGeometry = new THREE.PlaneGeometry(300, 300);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -0.9;
plane.receiveShadow = true;
// scene.add(plane);

const raycaster = new THREE.Raycaster(); //for mouse interaction
const mouse = new THREE.Vector2();

let geometryArray = ["BoxGeometry", "SphereGeometry", "PlaneGeometry", "CircleGeometry", "ConeGeometry", "CylinderGeometry", "RingGeometry", "TorusGeometry", "TorusKnotGeometry", "DodecahedronGeometry", "IcosahedronGeometry", "OctahedronGeometry", "TetrahedronGeometry", "CapsuleGeometry", "LatheGeometry", "TubeGeometry", "ShapeGeometry", "ExtrudeGeometry", "RoundedBoxGeometry"];

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
        // obj.material.wireframe = true;
    }
});

// Event: Keyboard arrows to move cube
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') sphere.position.x -= 0.2;
    if (e.key === 'ArrowRight') sphere.position.x += 0.2;
    if (e.key === 'ArrowUp') sphere.position.z -= 0.2;
    if (e.key === 'ArrowDown') sphere.position.z += 0.2;
});

// Create lil-gui for controls
const gui = new GUI();

const cubeProperties = {
    rotationX: 0.01,
    rotationY: 0.01,
    rotationZ: 0.01,
    scale: 1,
    color: cube.material.color.getHex()
};

const cameraProperties = {
    positionX: 4,
    positionXdelta: .001,
    positionY: 3,
    positionYdelta: .001,
    positionZ: -3,
    positionZdelta: .001,
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

const sphereFolder = gui.addFolder('Sphere');
sphereFolder.add(sphere.position, 'x', -5, 5).name('position X');
sphereFolder.add(sphere.position, 'y', -5, 5).name('position Y');
sphereFolder.add(sphere.rotation, 'y', 0, Math.PI * 2).name('rotation Y');
sphereFolder.close();

const cameraFolder = gui.addFolder('Camera')
let positionXdelta = 0.001;
let positionYdelta = 0.001;
let positionZdelta = 0.001;
// Position
cameraFolder.add(cameraProperties, 'positionX', -10, 10).onChange((v) => activeCamera.position.x = v)
cameraFolder.add(cameraProperties, 'positionY', -10, 10).onChange((v) => activeCamera.position.y = v)
cameraFolder.add(cameraProperties, 'positionZ', -10, 10).onChange((v) => activeCamera.position.z = v)
cameraFolder.add(cameraProperties, 'positionXdelta', -1, 1).onChange((v) => positionXdelta = v).name('positionXdelta');
cameraFolder.add(cameraProperties, 'positionYdelta', -1, 1).onChange((v) => positionYdelta = v).name('positionYdelta');
cameraFolder.add(cameraProperties, 'positionZdelta', -1, 1).onChange((v) => positionZdelta = v).name('positionZdelta');
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





function worldChange(Texture) {
    scene.background = Texture;
    cubeStandardMaterial.envMap = Texture;
    sphere.material.envMap = Texture;
}


const worlds = {
    Weltraum: WeltraumTexture,
    MilkyWay: MilkyWayTexture,
    park: parkTexture
};


const skyboxOptions = { skybox: 'MilkyWay' };
gui.add(skyboxOptions, 'skybox', Object.keys(worlds)).onChange((value) => {
    worldChange(worlds[value]);
});





// gui.close();

// === ANIMATION LOOP ===
// This function keeps running and updates the scene every frame
function animate(time) {
    requestAnimationFrame(animate); // call this function again on the next frame
    const t = time * 0.001; // convert to seconds
    // console.log(t);
    sphere.position.y = Math.sin(t) * 0.5;
    sphere.rotation.y = Math.sin(t) * 0.5;
    sphere.position.x += -0.01;
    cube.position.x += -0.03;
    // Rotate the cube a bit every frame
    // cube.rotation.x += sceneProperties.rotationX; // use if useing sceneProperties
    // cube.rotation.y += sceneProperties.rotationY; // use if useing sceneProperties
    cube.rotation.x += cubeProperties.rotationX;
    cube.rotation.y += cubeProperties.rotationY;
    cube.rotation.z += cubeProperties.rotationZ;
    controls.update(); // update camera controls (needed if damping is enabled)
    // controls.update(clock.getDelta())  // FlyControls and FirstPersonControls need deltaTime in update.
    activeCamera.position.x += positionXdelta;
    activeCamera.position.y += positionYdelta;
    activeCamera.position.z += positionZdelta;

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




// function setupControls(camera, renderer, gui) {
//     const controlsOptions = {
//         controlType: 'OrbitControls',
//     }

//     let currentControls = null

//     const setControls = (type) => {
//         if (currentControls) {
//             currentControls.dispose()
//             window.removeEventListener('keydown', currentControls.keydownHandler)
//             window.removeEventListener('keyup', currentControls.keyupHandler)
//         }

//         switch (type) {
//             case 'OrbitControls':
//                 currentControls = new OrbitControls(camera, renderer.domElement)
//                 currentControls.enableDamping = true
//                 break
//             case 'FlyControls':
//                 currentControls = new FlyControls(camera, renderer.domElement)
//                 currentControls.movementSpeed = 10
//                 currentControls.rollSpeed = Math.PI / 24
//                 break
//             case 'FirstPersonControls':
//                 currentControls = new FirstPersonControls(camera, renderer.domElement)
//                 currentControls.lookSpeed = 0.1
//                 currentControls.movementSpeed = 5
//                 break
//         }
//     }

//     gui.add(controlsOptions, 'controlType', [
//         'OrbitControls',
//         'FlyControls',
//         'FirstPersonControls',
//     ]).onChange(setControls)

//     setControls(controlsOptions.controlType)

//     return {
//         update: (delta) => {
//             if (currentControls?.update) currentControls.update(delta)
//         },
//     }
// }




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