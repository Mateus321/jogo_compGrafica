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
let tempMessage = new SecondaryBox("");

let pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
const carro = new Carro(scene, pista.getInicial(), keyboard);

voltasMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
voltasMessage.box.style.bottom = "92%";
voltasMessage.box.style.left = "2%";

tempMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
tempMessage.box.style.bottom = "88%";
tempMessage.box.style.left = "2%";

function updateVoltasMessage()
{
   let str =  "Voltas: " + carro.voltas;
   voltasMessage.changeMessage(str);
}

function updateTempMenssage()
{
    let str = "Tempo total: " + carro.tempo;
    tempMessage.changeMessage(str);
}

const trocaPista = () => {
  if(pista){
    pista.removePista();
  }
  const novaPista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
  let inicial = novaPista.getInicial();
  carro.reset();
  return novaPista;
}

const keyboardUpdate = () => {
  keyboard.update();
  if(keyboard.down("1")){
    pistaEscolhida = 0;
    pista = trocaPista();
  }
  if(keyboard.down("2")){
    pistaEscolhida = 1;
    pista = trocaPista();
  } 
}


const start = () => {
    carro.cron = setInterval(() => {time()}, carro.temp);
} 

const time = ( ) => {
  carro.ss++;

  if(carro.ss == 60)
  {
    carro.ss = 0;
    carro.mm++;
  }
  
  let format = (carro.mm < 10 ? '0' + carro.mm : carro.mm ) + ':' + (carro.ss < 10 ? '0' + carro.ss : carro.ss);
            
  carro.tempo = format;
}
start();
render();

function render()
{
  updateVoltasMessage();
  updateTempMenssage();
  keyboardUpdate();
  carro.keyboardUpdate();
  trackballControls.update();
  carro.penalidade(pista);
  trackballControls.target.copy(carro.carro.position); // Camera following object
  if(pista.checkpointsVisitados(carro)){
    carro.voltas += 1;
    carro.checkpointsVisitados = [];
    pista.proximoCheckpoint = 0;
  }
  
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
  
}