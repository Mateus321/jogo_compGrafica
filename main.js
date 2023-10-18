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

let inspec = false;

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
//camera = initCamera(new THREE.Vector3(30,15,45)); // Init camera in this position
camera = initCamera(new THREE.Vector3(27,6,50)); // Init camera in this position
camera.lookAt(40,0,20);
light = initDefaultBasicLight(scene); // Enable mouse rotation, pan, zoom etc.
// initDefaultSpotlight(scene, new THREE.Vector3(35, 20, 30)); // Use default light

let inspecCamera = initCamera(new THREE.Vector3(-45,20,140));
//inspecCamera.lookAt(150,100,200);
orbit = new OrbitControls( inspecCamera, renderer.domElement );

let pistaEscolhida = 0;



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let plane = createGroundPlaneXZ(200, 200);
scene.add(plane);


var keyboard = new KeyboardState();

let trackballControls = new TrackballControls( camera, renderer.domElement );
let inspecTrackballControls = new TrackballControls( inspecCamera, renderer.domElement );


let voltasMessage = new SecondaryBox("");
let tempMessage = new SecondaryBox("");
let volta1Message = new SecondaryBox("");
let volta2Message = new SecondaryBox("");
let volta3Message = new SecondaryBox("");
let volta4Message = new SecondaryBox("");


let pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
const carro = new Carro(scene, pista.getInicial(), keyboard);

const distanciaCamera = carro.carro.position.distanceToSquared(camera.position);

const distanciaCameraX = camera.position.x - carro.carro.position.x;
const distanciaCameraZ = (camera.position.z - carro.carro.position.z);

voltasMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
voltasMessage.box.style.bottom = "92%";
voltasMessage.box.style.left = "2%";

tempMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
tempMessage.box.style.bottom = "88%";
tempMessage.box.style.left = "2%";

volta1Message.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
volta1Message.box.style.bottom = "84%";
volta1Message.box.style.left = "2%";

volta2Message.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
volta2Message.box.style.bottom = "80%";
volta2Message.box.style.left = "2%";

volta3Message.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
volta3Message.box.style.bottom = "76%";
volta3Message.box.style.left = "2%";

volta4Message.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
volta4Message.box.style.bottom = "72%";
volta4Message.box.style.left = "2%";


function updateVoltasMessage()
{
   let str =  "Voltas: " + carro.voltas;
   if(carro.voltas == 4){
    carro.pause();
    str = "Voce finalizou a corrida!!!"
    carro.velocidade = 0.0000;
   }
   voltasMessage.changeMessage(str);
}

function updateTempMenssage()
{
  let str, str1, str2, str3, str4;
    switch(carro.tempo.length){
      case 1:
        str = "Tempo total: " + carro.tempo[0];
        break;
      case 2:
        str = "Tempo total: " + carro.tempo[0];
        str1 = "Volta 1: " + carro.tempoV[1];
        
        break;
      case 3:
        str = "Tempo total: " + carro.tempo[0];
        str1 = "Volta 1: " + carro.tempoV[1];
        str2 = "Volta 2: " + carro.tempoV[2];
        break;
      case 4:
        str = "Tempo total: " + carro.tempo[0];
        str1 = "Volta 1: " + carro.tempoV[1];
        str2 = "Volta 2: " + carro.tempoV[2];
        str3 = "Votla 3: " + carro.tempoV[3];
        break;
      case 5:
        str = "Tempo total: " + carro.tempo[0];
        str1 = "Volta 1: " + carro.tempoV[1];
        str2 = "Volta 2: " + carro.tempoV[2];
        str3 = "Volta 3: " + carro.tempoV[3];
        str4 = "Volta 4: " + carro.tempoV[4];
        break;
        

    }
    tempMessage.changeMessage(str);
    volta1Message.changeMessage(str1);
    volta2Message.changeMessage(str2);
    volta3Message.changeMessage(str3);
    volta4Message.changeMessage(str4);
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

const hideMessages =  () => {
  tempMessage.hide();
  volta1Message.hide();
  volta2Message.hide();
  volta3Message.hide();
  volta4Message.hide();
}

const toggleInspec = () => {
  if(!inspec){
  carro.carro.scale.set(10,10,10);
  scene.remove(plane);
  carro.reset();
  pista.removePista();
  hideMessages();
  }else{
    carro.carro.scale.set(0.15,0.15,0.15);
    scene.add(plane);
    pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
  }
  inspec = !inspec;
}

const keyboardUpdate = () => {
  keyboard.update();
  if(keyboard.down("space")) toggleInspec();
  if(keyboard.down("1")){
    pistaEscolhida = 0;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  }
  if(keyboard.down("2")){
    pistaEscolhida = 1;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  } 
  if(keyboard.down("3")){
    pistaEscolhida = 2;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  } 
  if(keyboard.down("4")){
    pistaEscolhida = 3;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  } 
}






function updateCameraLookAt(){
  camera.lookAt(carro.carro.position);
}
// posição da camera = distancia fixa + posicão do carro
function updateCameraPosition(){
  if(distanciaCamera != carro.carro.position.distanceToSquared(camera.position)){
    updateCameraLookAt();
    camera.position.set(carro.carro.position.x + distanciaCameraX, camera.position.y, carro.carro.position.z + distanciaCameraZ);
  }
}
carro.start();
carro.startVolta();
render();

function render()
{
  
  keyboardUpdate();
  requestAnimationFrame(render);
  if(!inspec){
    trackballControls.update();
    trackballControls.target.copy(carro.carro.position);
    carro.keyboardUpdate();
    updateVoltasMessage();
    updateTempMenssage();
    updateCameraPosition();
    carro.penalidade(pista);
    if(pista.checkpointsVisitados(carro)){
      
      carro.tempo.push(carro.tempo[0]);
      carro.tempoV.push(carro.tempoV[0]);
      carro.voltas += 1;
      carro.checkpointsVisitados = [];
      pista.proximoCheckpoint = 0;
      carro.resetVolta();
    }
    renderer.render(scene, camera) 
  }else{
    renderer.render(scene, inspecCamera);
    console.log(inspecCamera);
    // inspecTrackballControls.update();
  }
}// Render scene
  