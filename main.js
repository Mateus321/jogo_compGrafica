import * as THREE from  'three';
// import { Carro } from './carro.js';
import { Carro } from './cybertruckobj.js';
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
import { Vector3 } from '../build/three.module.js';

let inspec = false;

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
//renderer = initRenderer();    // Init a basic renderer
renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild( renderer.domElement );  
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type  = THREE.VSMShadowMap; // default
//camera = initCamera(new THREE.Vector3(30,15,45)); // Init camera in this position
camera = initCamera(new THREE.Vector3(30,7,50)); // Init camera in this position
camera.lookAt(40,0,20);
 // Enable mouse rotation, pan, zoom etc.
// initDefaultSpotlight(scene, new THREE.Vector3(35, 20, 30)); // Use default light

// criando luz direcional
let lightColor = "rgb(255,255,255)";
let lightPosition = new THREE.Vector3(45.0, 50.0, 50.0);
let dirLight = new THREE.DirectionalLight(lightColor);

let camera3rd = initCamera(new THREE.Vector3 (32, 4 ,40));
camera3rd.lookAt(20,0,40);

dirLight.position.copy(lightPosition)
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
dirLight.name = "Direction Light";

scene.add(dirLight);

// criando luz ambiente 
let ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight)

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
let camMode = 0; // camera 0 - normal, camera 1 - 3a pessoa, camera 2 - inspeção



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

export default function setMaterial(file, repeatU = 1, repeatV = 1, color = 'rgb(255,255,255)'){
  let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color:color});
  mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
  mat.map.repeat.set(repeatU,repeatV); 
  return mat;
}

let loader = new THREE.TextureLoader();
function createGroundPlane(width, height, widthSegments = 10, heightSegments = 10, gcolor = null) {
  if (!gcolor) gcolor = "rgb(200,200,200)";
  let planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  let planeMaterial =  [setMaterial('../assets/textures/grass.jpg',4,4),
  setMaterial('../assets/textures/intertravado.jpg',30,30), //y-  Just a color
  setMaterial('../assets/textures/sand.jpg',30,30), //z+
  setMaterial('../assets/textures/sun.jpg',3,3) //z- //y+
  ];
  let mat4 = new THREE.Matrix4(); // Aux mat4 matrix   
  let plane;
  switch(pistaEscolhida){
    case 0:
    plane = new THREE.Mesh(planeGeometry, planeMaterial[0]);
    break;
    case 1:
    plane = new THREE.Mesh(planeGeometry, planeMaterial[1]);
    break;
    case 2:
    plane = new THREE.Mesh(planeGeometry, planeMaterial[2]);
    break;
    case 3:
    plane = new THREE.Mesh(planeGeometry, planeMaterial[3]);
    break;
  }
  plane.receiveShadow = true;
  // Rotate 90 in X and perform a small translation in Y
  plane.matrixAutoUpdate = false;
  plane.matrix.identity();    // resetting matrices
  // Will execute R1 and then T1
  plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0)); // T1   
  plane.matrix.multiply(mat4.makeRotationX(-Math.PI/2)); // R1   

  return plane;
}

// Show axes (parameter is size of each axis)
let planeSize = 225;
let plane = createGroundPlane(planeSize, planeSize);

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
let velocidadeMessage = new SecondaryBox("");


let pista = new Pista(listaPistas[pistaEscolhida].id, listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
const carro = new Carro(scene, pista.getInicial(), keyboard);

const distanciaCamera = carro.carro.position.distanceToSquared(camera.position);

const distanciaCameraX = camera.position.x - carro.carro.position.x;
const distanciaCameraZ = (camera.position.z - carro.carro.position.z);

const distanciaCamera3rd = carro.carro.position.distanceToSquared(camera3rd.position);

const distanciaCamera3rdX = camera3rd.position.x - carro.carro.position.x;
const distanciaCamera3rdZ = camera3rd.position.z - carro.carro.position.z;

const distanciaLuzX = dirLight.position.x - carro.carro.position.x;
const distanciaLuzZ = dirLight.position.z - carro.carro.position.z;

voltasMessage.changeStyle("rgba(0,0,0,0)", "white", "32px", "ubuntu")
voltasMessage.box.style.bottom = "92%";
voltasMessage.box.style.left = "2%";

velocidadeMessage.changeStyle("rgba(55,55,55,0)", "white", "32px", "unbutu");
velocidadeMessage.box.style.bottom = "8%";
velocidadeMessage.box.style.left = "80%";

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

function updateVelocidadeMessage(){
  let str = "Velocidade: " + (Number(carro.velocidade * 200).toFixed(3)) + "   m/s"; 
  velocidadeMessage.changeMessage(str);
}


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
  if(plane){
    scene.remove(plane);
  }
  plane = createGroundPlane(planeSize, planeSize);
  scene.add(plane);
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

const toggleCamChange = () => {
  if(camMode == 2){
    camMode = 0;
  }else{
    camMode += 1;
  }
  switch(camMode){
    case 0:
    carro.carro.scale.set(0.15,0.15,0.15);
    scene.add(plane);
    pista = new Pista(listaPistas[pistaEscolhida].id, 
      listaPistas[pistaEscolhida].posicoes, listaPistas[pistaEscolhida].checkpoints, scene);
      break;
    case 2:
      carro.carro.scale.set(10,10,10);
      scene.remove(plane);
      carro.reset();
      pista.removePista();
      hideMessages();
      break;
  }
 
}



const keyboardUpdate = () => {
  keyboard.update();
  if(keyboard.down("space")) toggleCamChange();
  if(keyboard.down("1")){
    if(pistaEscolhida != 0){
      virtualCamera.position.set(20,70,20);
    }
    pistaEscolhida = 0;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = 0.0008;
  }
  if(keyboard.down("2")){
    if(pistaEscolhida != 1){
      virtualCamera.position.set(20,70,20);
    }
    pistaEscolhida = 1;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = 0.0008;
  } 
  if(keyboard.down("3")){
    if(pistaEscolhida != 2){
      virtualCamera.position.set(45,110,40);
    }
    pistaEscolhida = 2;
    pista = trocaPista();
    carro.carro.rotation.y = Math.PI/2;
    carro.tempo.length = 0;
    carro.aceleracao = 0.0008;
  } 
  if(keyboard.down("4")){
    if(pistaEscolhida != 3){
      virtualCamera.position.set(45,90,45);
    }
    pistaEscolhida = 3;
    pista = trocaPista();
    carro.tempo.length = 0;
    carro.aceleracao = 0.0008;
  } 
}


function updateCameraLookAt(){
  camera.lookAt(carro.carro.position);
}
// posição da camera = distancia fixa + posicão do carro
function updateCameraPosition(){
    camera.position.set(carro.carro.position.x + distanciaCameraX, camera.position.y, carro.carro.position.z + distanciaCameraZ);
    dirLight.position.set(carro.carro.position.x + distanciaLuzX, dirLight.position.y, carro.carro.position.z + distanciaLuzZ);
    updateCameraLookAt();
}

function updateCamera3rdLookAt(){
  camera3rd.lookAt(carro.carro.position);
}

function updateCamera3rdPosition(){
  let matrix = new THREE.Matrix4();
  matrix.extractRotation(carro.carro.matrix);
  let offset = new THREE.Vector3 (-distanciaCamera3rdX, 4 ,-distanciaCamera3rdZ);
  offset.applyMatrix4(matrix);
  let camera3rdPosition = carro.carro.position.clone().add(offset);
  camera3rd.position.set(camera3rdPosition.x, camera3rd.position.y, camera3rdPosition.z);
  dirLight.position.set(carro.carro.position.x + distanciaLuzX, dirLight.position.y, carro.carro.position.z + distanciaLuzZ);
  updateCamera3rdLookAt();
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

function vcRender3rd(){
  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");
  updateCamera3rdPosition();
  renderer.clear();   // Clean the window
  renderer.render(scene, camera3rd);

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

function vcRenderInspec(){
  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");
  renderer.clear();   // Clean the window
  renderer.render(scene, inspecCamera);
}

function render()
{
  
  keyboardUpdate();
  
  requestAnimationFrame(render);
  carro.updateConvexObject();
  
  switch(camMode){
    // trackballControls.update();
    // trackballControls.target.copy(carro.carro.position);
    case 0:
      carro.keyboardUpdate(camMode);
      updateVoltasMessage();
      updateTempMenssage();
      updateVelocidadeMessage();
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
    break;
    case 1:
      carro.keyboardUpdate(camMode);
      updateVoltasMessage();
      updateTempMenssage();
      updateVelocidadeMessage();
      carro.penalidade(pista);
      if(pista.checkpointsVisitados(carro)){
        
        carro.tempo.push(carro.tempo[0]);
        carro.tempoV.push(carro.tempoV[0]);
        carro.voltas += 1;
        carro.checkpointsVisitados = [];
        pista.proximoCheckpoint = 0;
        carro.resetVolta();
      }
      vcRender3rd();
      break;
    case 2:
      vcRenderInspec();
      carro.keyboardUpdate(camMode)
      break;
    }
}// Render scene
  