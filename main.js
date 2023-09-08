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
        SecondaryBox,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(30,15,45)); // Init camera in this position
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

let trackballControls = new TrackballControls( camera, renderer.domElement );


let voltasMessage = new SecondaryBox("");

const pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, scene);
const carro = new Carro(scene, pista.getInicial(), keyboard);

voltasMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
voltasMessage.box.style.bottom = "92%";
voltasMessage.box.style.left = "2%";


function updateVoltasMessage()
{
   let str =  "Voltas: " + carro.voltas;
   voltasMessage.changeMessage(str);
}

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
  updateVoltasMessage();
  carro.keyboardUpdate();
  trackballControls.update();
  trackballControls.target.copy(carro.carro.position); // Camera following object
  if(pista.checkpointsVisitados(carro)){
    carro.voltas += 1;
    carro.checkpointsVisitados = [];
    pista.proximoCheckpoint = 0;
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}