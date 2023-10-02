import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(200, 200)
scene.add(plane);

// -> bloco 1
// create a cube
const materialInicial = new THREE.MeshBasicMaterial( {color: 0xffff00});
let cubeGeometry = new THREE.BoxGeometry(10, 0.3, 10);
let pista1 = new THREE.Mesh(cubeGeometry, materialInicial);
// position the cube
pista1.position.set(0.0, .0, 0.0);
// add the cube to the scene
scene.add(pista1);

// -> bloco 2
let pista2 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista2.position.set(10, 0, 0.0);
// add the cube to the scene
scene.add(pista2);

// -> bloco 3
let pista3 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista3.position.set(20, 0, 0.0);
// add the cube to the scene
scene.add(pista3);

// -> bloco 4
let pista4 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista4.position.set(30, 0, 0.0);
// add the cube to the scene
scene.add(pista4);

// -> bloco 5
let pista5 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista5.position.set(40, 0, 0.0);
// add the cube to the scene
scene.add(pista5);
 
// -> bloco 6 subiu
let pista6 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista6.position.set(40, 0, 10);
// add the cube to the scene
scene.add(pista6);

// -> bloco 7
let pista7 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista7.position.set(40, 0, 20);
// add the cube to the scene
scene.add(pista7);

// -> bloco 8
let pista8 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista8.position.set(40, 0, 30);
// add the cube to the scene
scene.add(pista8);

// -> bloco 9
let pista9 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista9.position.set(40, 0, 40);
// add the cube to the scene
scene.add(pista9);

// -> bloco 10 
let pista10 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista10.position.set(40, 0, 40);
// add the cube to the scene
scene.add(pista10);

// -> bloco 11 desceu
let pista11 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista11.position.set(30, 0, 40);
// add the cube to the scene
scene.add(pista11);

// -> bloco 12
let pista12 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista12.position.set(20, 0, 40);
// add the cube to the scene
scene.add(pista12);

// -> bloco 13
let pista13 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista13.position.set(10, 0, 40);
// add the cube to the scene
scene.add(pista13);

// -> bloco 14
let pista14 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista14.position.set(0, 0, 40);
// add the cube to the scene
scene.add(pista14);

// -> bloco 15
let pista15 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista15.position.set(0, 0, 30);
// add the cube to the scene
scene.add(pista15);

// -> bloco 16
let pista16 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista16.position.set(0, 0, 20);
// add the cube to the scene
scene.add(pista16);

// -> bloco 17
let pista17 = new THREE.Mesh(cubeGeometry, material);
// position the cube
pista17.position.set(0, 0, 10);
// add the cube to the scene
scene.add(pista17);



// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}