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
camera = initCamera(new THREE.Vector3(30,7,50)); // Init camera in this position
camera.lookAt(40,0,20);
light = initDefaultBasicLight(scene); // Enable mouse rotation, pan, zoom etc.
// initDefaultSpotlight(scene, new THREE.Vector3(35, 20, 30)); // Use default light

let inspecCamera = initCamera(new THREE.Vector3(-45,20,140));
//inspecCamera.lookAt(150,100,200);
orbit = new OrbitControls( inspecCamera, renderer.domElement );

let vcLookAt = new THREE.Vector3(20.0,0.0,20.0);
let vcPosition = new THREE.Vector3(20,110.0,20.0);
let vcUpVec = new THREE.Vector3(0.0,1.0,0.0);

let virtualCamera = new THREE.PerspectiveCamera(50.0,1.3,1.0,111.0);
virtualCamera.position.copy(vcPosition);
virtualCamera.lookAt(vcLookAt);
virtualCamera.up.copy(vcUpVec);

let pistaEscolhida = 0;



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let plane = createGroundPlaneXZ(250, 250);
scene.add(plane);


var keyboard = new KeyboardState();

// let trackballControls = new TrackballControls( camera, renderer.domElement );
// let inspecTrackballControls = new TrackballControls( inspecCamera, renderer.domElement );


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
  carro.inicial = inicial;
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
    if(pistaEscolhida != 0){
      virtualCamera.position.set(20,70,20);
    }
    pistaEscolhida = 0;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  }
  if(keyboard.down("2")){
    if(pistaEscolhida != 1){
      virtualCamera.position.set(20,70,20);
    }
    pistaEscolhida = 1;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  } 
  if(keyboard.down("3")){
    if(pistaEscolhida != 2){
      virtualCamera.position.set(45,110,40);
    }
    pistaEscolhida = 2;
    pista = trocaPista();
    carro.carro.rotation.y = -Math.PI/2;
    carro.tempo.length = 0;
    carro.aceleracao = -0.0008;
  } 
  if(keyboard.down("4")){
    if(pistaEscolhida != 3){
      virtualCamera.position.set(45,90,45);
    }
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
    camera.position.set(carro.carro.position.x + distanciaCameraX, camera.position.y, carro.carro.position.z + distanciaCameraZ);
  }else{
    updateCameraLookAt();
  }
  
}
carro.start();
carro.startVolta();
render();

function vcRender(){
  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");
  updateCameraPosition();
  renderer.clear();   // Clean the window
  renderer.render(scene, camera);

  // If autoClear if false, clear depth buffer to avoid unwanted overlays
  if (!renderer.autoClear) renderer.clearDepth()  // Clean the small viewport 
  
  let offset = 10;
  let vcWidth = (width/3 > 400) ? 400 : width / 3;
  let vcHeight =  vcWidth * 0.75;
  renderer.setViewport(offset, height - vcHeight - offset, vcWidth, vcHeight);
  renderer.setScissor(offset, height - vcHeight - offset, vcWidth-1, vcHeight -1);
  renderer.setScissorTest(true);
  renderer.setClearColor("rgb(60,50,150)");
  renderer.render(scene, virtualCamera);
}

function render()
{
  
  keyboardUpdate();
  
  requestAnimationFrame(render);
  if(!inspec){
    // trackballControls.update();
    // trackballControls.target.copy(carro.carro.position);
    
    carro.keyboardUpdate();
    updateVoltasMessage();
    updateTempMenssage();
    carro.penalidade(pista);
    if(pista.checkpointsVisitados(carro)){
      
      carro.tempo.push(carro.tempo[0]);
      carro.tempoV.push(carro.tempoV[0]);
      carro.voltas += 1;
      carro.checkpointsVisitados = [];
      pista.proximoCheckpoint = 0;
      carro.resetVolta();
    }
    vcRender();
  }else{
    renderer.render(scene, inspecCamera);
    console.log(inspecCamera);
    // inspecTrackballControls.update();
  }
}// Render scene
  