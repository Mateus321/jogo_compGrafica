import * as THREE from  'three';
import { Carro } from './carro.js';
import {Pista, listaPistas} from './pistaarray.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultSpotlight,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(35,15,60)); // Init camera in this position
light = initDefaultBasicLight(scene);
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
// initDefaultSpotlight(scene, new THREE.Vector3(35, 20, 30)); // Use default light

let pistaEscolhida = 0;



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let plane = createGroundPlaneXZ(200, 200);
scene.add(plane);


var keyboard = new KeyboardState();

var trackballControls = new TrackballControls( camera, renderer.domElement );


const pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, scene);
const carro = new Carro(scene, pista.getInicial(), keyboard);
render();




// Use this to show information onscreen
// let controls = new InfoBox();
//   controls.add("Basic Scene");
//   controls.addParagraph();
//   controls.add("Use mouse to interact:");
//   controls.add("* Left button to rotate");
//   controls.add("* Right button to translate (pan)");
//   controls.add("* Scroll to zoom in/out.");
//   controls.show();



function render()
{
  carro.keyboardUpdate();
  trackballControls.update();
  // trackballControls.target.copy(carro.carro.position); // Camera following object

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}