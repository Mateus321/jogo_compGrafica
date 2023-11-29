import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { Pista } from "./pistaarray.js";
import { CSG} from '../libs/other/CSGMesh.js' 

import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  SecondaryBox,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { ConvexGeometry } from "../build/jsm/geometries/ConvexGeometry.js";
import { BoxGeometry, Scene } from "../build/three.module.js";
//import { convertArray } from 'three/src/animation/AnimationUtils.js';

// Listen window size changes

// Use to scale the cube
var scale = 1.0;

// Show text information onscreen
var tetoConvex = null;
var teto = null;
var paraChoquefConvex = null;
var paraChoquef = null;
var vidroFrenteConvex = null;
var vidroLateralConvex = null;
var vidroLateral1Convex = null;
var vidroTraseiroConvex = null;
var tampaTraseiraConvex = null;
var vidroFrente = null;
var vidroLateral = null;
var vidroLateral1 = null;
var vidroTraseiro = null;
var tampaTraseira = null;
let castShadow = true;
let objectVisibility = true;
let objOpacity = 0.05;
const numInstances = 100;

// To use the keyboard

// Show axes (parameter is size of each axis)

// create the ground plane
// scene.add(plane);
let loader = new THREE.TextureLoader();
function setMaterial(file, repeatU = 1, repeatV = 1, color = 'rgb(255,255,255)', opacity = 1){
  let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color:color, opacity:opacity});
  mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
  mat.map.repeat.set(repeatU,repeatV); 
  return mat;
}

var estruturaMaterial = new THREE.MeshPhongMaterial({
  color: 0x636d73,
  opacity: objOpacity,
  transparent: false,
});

// let estruturaMaterial = setMaterial('../assets/textures/metalPreto.avif', 0.2, 1);
  
var vidroMaterial = new THREE.MeshPhongMaterial({
  color: 0x1f2224,
  opacity: objOpacity,
  transparent: true,
});

// let vidroMaterial = setMaterial('../assets/textures/vidrocarro.avif', 1,1);

var tampaMaterial = new THREE.MeshLambertMaterial({
   color: 0x1e1e1e,
   opacity: 0.1,
   transparent: true,
 });


function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

export class Carro {
  constructor(scene, inicial, keyboard) {
    this.scene = scene;
    this.keyboard = keyboard;

    this.inicial = inicial;

    this.materialCarro = new THREE.MeshPhongMaterial({ color: 0xf0130a });

    this.checkpointsVisitados = [];
    this.voltas = 0;
    this.temp = 1;
    this.cron;
    this.ms = 0;
    this.mm = 0;
    this.ss = 0;
    this.tempo = [""];

    this.tempVolta = 1;
    this.cronVolta;
    this.msV = 0;
    this.mmV = 0;
    this.ssV = 0;
    this.tempoV = [""];

    this.castShadow = true;
    this.objectVisibility = true;

    this.carro = new THREE.Object3D();

    this.criaBase = function () {
      let auxMat = new THREE.Matrix4();
      let baseMesh = new THREE.Mesh( new THREE.BoxGeometry(12, 2.2, 5.5));
      let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(0.26, 0.26, 0.2, 8))
      cylinderMesh.position.set(3,-1,-3);
      cylinderMesh.scale.set(5,5,5);
      cylinderMesh.rotateX(THREE.MathUtils.degToRad(90));
      updateObject(cylinderMesh);
      let baseCSG = CSG.fromMesh(baseMesh);
      let cylinderCSG = CSG.fromMesh(cylinderMesh);
      let csgObject = baseCSG.subtract(cylinderCSG);
      cylinderMesh.position.set(3,-1, 3);
      updateObject(cylinderMesh);
      cylinderCSG = CSG.fromMesh(cylinderMesh);
      cylinderMesh.position.set(3,-1, 3);
      updateObject(cylinderMesh);
      cylinderCSG = CSG.fromMesh(cylinderMesh);
      csgObject = csgObject.subtract(cylinderCSG);
      cylinderMesh.position.set(-4,-1, -3);
      updateObject(cylinderMesh);
      cylinderCSG = CSG.fromMesh(cylinderMesh);
      csgObject = csgObject.subtract(cylinderCSG);
      cylinderMesh.position.set(-4,-1, 3);
      updateObject(cylinderMesh);
      cylinderCSG = CSG.fromMesh(cylinderMesh);
      csgObject = csgObject.subtract(cylinderCSG);
      let base = CSG.toMesh(csgObject, auxMat);
      // base.add(cylinderMesh);
      base.material = estruturaMaterial;
      base.castShadow = castShadow;
      base.objectVisibility = objectVisibility;
      return base;
    };

    /*this.paraChoqueTras = function(){
            var paraChoqueT = []

            paraChoqueT.push(new THREE.Vector3(-1,1,1));
            paraChoqueT.push(new THREE.Vector3(-1,-1,1));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,1));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,0));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,0));
            paraChoqueT.push(new THREE.Vector3(-0.6,-1,0));

            return paraChoqueT;
        }*/

    this.criarEixo = function () {
      const eixosC = new THREE.CylinderGeometry(0.2, 0.2, 6, 24);
      const material_eixos = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      const eixo = new THREE.Mesh(eixosC, material_eixos);
      return eixo;
    };

    this.criarEsfera = () => {
      const geometria_esfera = new THREE.SphereGeometry(0.1, 32, 16);
      const material_esfera = new THREE.MeshLambertMaterial({ color: 0xe3efdf });
      const esfera = new THREE.Mesh(geometria_esfera, material_esfera);
      return esfera;
    };

    this.criarCalota = function () {
      const calotaS = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 8);
      const material_calota = setMaterial('../assets/textures/metal.jpg', 0.2, 1);
      const calota = new THREE.Mesh(calotaS, material_calota);
      return calota;
    };
    
    this.criarPneu = function () {
      const rodas = new THREE.TorusGeometry(0.8, 0.3, 16, 50);
      const material_rodas = setMaterial('assets/textures/borracha.avif', 4, 2);
      const roda = new THREE.Mesh(rodas, material_rodas);
      return roda;
    };

    this.criaAro = () => {
      const geometria_aro = new THREE.BoxGeometry(0.1, 1.4 , 0.01);
      const material_aro = new THREE.MeshLambertMaterial({ color: 0x1e1e1e });
      const aro = new THREE.Mesh(geometria_aro, material_aro);
      return aro;
    }

    this.criaTeto = function () {
      var tetoC = [];

      tetoC.push(new THREE.Vector3(2.06, 0.95, 1));
      tetoC.push(new THREE.Vector3(-2.06, 0.95, 1));
      tetoC.push(new THREE.Vector3(2.06, -0.95, 1));
      tetoC.push(new THREE.Vector3(-2.06, -0.95, 1));
      tetoC.push(new THREE.Vector3(0.5, 0.95, 1.5));
      tetoC.push(new THREE.Vector3(0.5, -0.95, 1.5));

      let tetoPoints = tetoC;

      tetoConvex = new ConvexGeometry(tetoPoints);
      return tetoConvex;
    };

    this.criaParaChoque = function () {
      var paraChoqueF = [];

      paraChoqueF.push(new THREE.Vector3(0, 0, 0));
      paraChoqueF.push(new THREE.Vector3(0, 0, 1.1));
      paraChoqueF.push(new THREE.Vector3(0.5, 0.5, 0.8));
      paraChoqueF.push(new THREE.Vector3(0.4, 0.5, 0.3));

      paraChoqueF.push(new THREE.Vector3(0, 2.8, 0));
      paraChoqueF.push(new THREE.Vector3(0, 2.8, 1.1));
      paraChoqueF.push(new THREE.Vector3(0.5, 2.3, 0.8));
      paraChoqueF.push(new THREE.Vector3(0.4, 2.3, 0.3));

      paraChoqueFPoints = paraChoqueF;

      paraChoquefConvex = new ConvexGeometry(paraChoqueFPoints);

      return paraChoquefConvex;
    };

    this.criaVidroFrente = function () {
      var vidro = [];

      vidro.push(new THREE.Vector3(2.08, 2, 1));
      vidro.push(new THREE.Vector3(-2, 2, 1));
      vidro.push(new THREE.Vector3(2.08, -1.5, 1));
      vidro.push(new THREE.Vector3(-2, -1.5, 1));

      let vidroFrentePoints = vidro;

      vidroFrenteConvex = new ConvexGeometry(vidroFrentePoints);

      return vidroFrenteConvex;
    };

    this.criaVidroLateral = function () {
      let vidro = [];

      vidro.push(new THREE.Vector3(-0.4, 0, 0.4));
      vidro.push(new THREE.Vector3(6.7, 0, 0.4));
      vidro.push(new THREE.Vector3(0, 0, 1));
      vidro.push(new THREE.Vector3(3, 0, 1.6));

      let vidroLateralPoints = vidro;

      vidroLateralConvex = new ConvexGeometry(vidroLateralPoints);

      return vidroLateralConvex;
    };

    this.criaVidroTraseiro = function () {
      var vidro = [];

      vidro.push(new THREE.Vector3(2.08, 2, 1));
      vidro.push(new THREE.Vector3(-2, 2, 1));
      vidro.push(new THREE.Vector3(2.08, -1, 1));
      vidro.push(new THREE.Vector3(-2, -1, 1));

      vidroTraseiroPoints = vidro;

      vidroTraseiroConvex = new ConvexGeometry(vidroTraseiroPoints);

      return vidroTraseiroConvex;
    };

    this.criaTampaTraseira = function () {
      var tampa = [];

      tampa.push(new THREE.Vector3(2.08, 2, 1));
      tampa.push(new THREE.Vector3(-2, 2, 1));
      tampa.push(new THREE.Vector3(2.08, -1, 1));
      tampa.push(new THREE.Vector3(-2, -1, 1));

      let tampaTraseiraPoints = tampa;

      tampaTraseiraConvex = new ConvexGeometry(tampaTraseiraPoints);

      return tampaTraseiraConvex;
    };

    let base;
    // let tetoPoints = this.criaTeto();

    let paraChoqueFPoints;
    let vidroFrentePoints;
    let vidroLateralPoints;
    let vidroTraseiroPoints;
    let tampaTraseiraPoints;
    base = this.criaBase();
    this.carro.add(base);

    tetoConvex = this.criaTeto();
    const tetoInstanceGeometry = new THREE.InstancedBufferGeometry().copy(
      tetoConvex
    );

    teto = new THREE.InstancedMesh(tetoConvex, estruturaMaterial, numInstances);

    teto.translateY(-1.8);
    teto.rotateX(THREE.MathUtils.degToRad(-90));
    teto.visible = true;
    teto.castShadow = true;
    teto.receiveShadow = true;
    const scale = 2.9;
    teto.scale.set(scale, scale, scale);
    base.add(teto);

    const matrixTeto = new THREE.Matrix4();
    const matrixTetoArray = new Float32Array(numInstances * 16);

    this.updateMatrixTeto = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixTeto.identity();
        matrixTeto.setPosition(
          teto.position.x,
          teto.position.y,
          teto.position.z
        );
        matrixTeto.makeRotationFromEuler(
          new THREE.Euler(teto.rotation.x, teto.rotation.y, teto.rotation.z)
        );
        matrixTetoArray.set(matrixTeto.elements, i * 16);
      }
    };

    this.updateMatrixTeto();

    tetoInstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixTetoArray, 16)
    );



    vidroFrenteConvex = this.criaVidroFrente();

    const vidroFrenteInstanceGeometry =
      new THREE.InstancedBufferGeometry().copy(vidroFrenteConvex);

    vidroFrente = new THREE.InstancedMesh(
      vidroFrenteConvex,
      vidroMaterial,
      numInstances
    );
    vidroFrente.translateZ(0.87);
    vidroFrente.translateX(1.2);
    vidroFrente.rotateX(THREE.MathUtils.degToRad(0));
    vidroFrente.rotateY(THREE.MathUtils.degToRad(17));
    vidroFrente.rotateZ(THREE.MathUtils.degToRad(90));
    const scale3 = 0.4;
    vidroFrente.scale.set(scale3, scale3, scale3);
    vidroFrente.castShadow = false;
    vidroFrente.receiveShadow = false;
    vidroFrente.visible = true;
    teto.add(vidroFrente);

    let texturaVidroGeometry = new THREE.BoxGeometry(4.16, 3.5,0.01);
    let texturaVidroMaterial = setMaterial('assets/textures/vidrocarro.avif',1,1,'rgb(255,255,255)', 0.1)
    let texturaVidro = new THREE.Mesh(texturaVidroGeometry, texturaVidroMaterial);
    
    vidroFrente.add(texturaVidro);

    texturaVidro.translateZ(1);
    texturaVidro.translateY(0.25);

    const matrixVidroFrente = new THREE.Matrix4();
    const matrixVidroFrenteArray = new Float32Array(numInstances * 16);

    this.updateMatrixVidroFrente = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixVidroFrente.identity();
        matrixVidroFrente.setPosition(
          vidroFrente.position.x,
          vidroFrente.position.y,
          vidroFrente.position.z
        );
        matrixVidroFrente.makeRotationFromEuler(
          new THREE.Euler(
            vidroFrente.rotation.x,
            vidroFrente.rotation.y,
            vidroFrente.rotation.z
          )
        );
        matrixVidroFrenteArray.set(matrixVidroFrente.elements * 16);
      }
    };

    this.updateMatrixVidroFrente();

    vidroFrenteInstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixVidroFrenteArray, 16)
    );

    paraChoquefConvex = this.criaParaChoque();

    const paraChoquefInstanceGeometry =
      new THREE.InstancedBufferGeometry().copy(paraChoquefConvex);

    paraChoquef = new THREE.InstancedMesh(
      paraChoquefConvex,
      estruturaMaterial,
      numInstances
    );
    base.add(paraChoquef);
    paraChoquef.translateX(6);
    paraChoquef.translateY(-1.1);
    paraChoquef.translateZ(2.85);
    paraChoquef.rotateX(THREE.MathUtils.degToRad(-90));
    paraChoquef.castShadow = true;
    const scale2 = 2;
    paraChoquef.scale.set(scale2, scale2, scale2);
    base.add(paraChoquef);

    const matrixParaChoquef = new THREE.Matrix4();
    const matrixParaChoquefArray = new Float32Array(numInstances * 16);

    this.updateMatrixParaChoquef = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixParaChoquef.identity();
        matrixParaChoquef.setPosition(
          paraChoquef.position.x,
          paraChoquef.position.y,
          paraChoquef.position.z
        );
        matrixParaChoquef.makeRotationFromEuler(
          new THREE.Euler(
            paraChoquef.rotation.x,
            paraChoquef.rotation.y,
            paraChoquef.rotation.z
          )
        );
        matrixParaChoquefArray.set(matrixParaChoquef.elements * 16);
      }
    };

    this.updateMatrixParaChoquef();

    paraChoquefInstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixParaChoquefArray, 16)
    );

    vidroLateralConvex = this.criaVidroLateral();
    vidroLateral1Convex = this.criaVidroLateral();

    const vidroLateralInstanceGeometry =
      new THREE.InstancedBufferGeometry().copy(vidroLateralConvex);
    const vidroLateral1InstanceGeometry =
      new THREE.InstancedBufferGeometry().copy(vidroLateral1Convex);

    vidroLateral = new THREE.InstancedMesh(
      vidroLateralConvex,
      vidroMaterial,
      numInstances
    );
    vidroLateral1 = new THREE.InstancedMesh(
      vidroLateral1Convex,
      vidroMaterial,
      numInstances
    );

    vidroLateral.translateZ(0.83);
    vidroLateral.translateY(-0.96);
    vidroLateral.translateX(-0.7);
    const scale4 = 0.4;
    vidroLateral.scale.set(scale4, scale4, scale4);

    teto.add(vidroLateral);

    const matrixVidroLateral = new THREE.Matrix4();
    const matrixVidroLateralArray = new Float32Array(numInstances * 16);

    this.updateMatrixVidroLateral = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixVidroLateral.identity();
        matrixVidroLateral.setPosition(
          vidroLateral.position.x,
          vidroLateral.position.y,
          vidroLateral.position.z
        );
        matrixVidroLateral.makeRotationFromEuler(
          new THREE.Euler(
            vidroLateral.rotation.x,
            vidroLateral.rotation.y,
            vidroLateral.rotation.z
          )
        );
        matrixVidroLateralArray.set(matrixVidroLateral.elements * 16);
      }
    };

    vidroLateralInstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixVidroLateralArray, 16)
    );

    this.updateMatrixVidroLateral();

    vidroLateral1.translateZ(0.83);
    vidroLateral1.translateY(0.96);
    vidroLateral1.translateX(-0.7);
    vidroLateral1.scale.set(scale4, scale4, scale4);

    teto.add(vidroLateral1);

    const matrixVidroLateral1 = new THREE.Matrix4();
    const matrixVidroLateral1Array = new Float32Array(numInstances * 16);

    this.updateMatrixVidroLateral1 = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixVidroLateral1.identity();
        matrixVidroLateral1.setPosition(
          vidroLateral1.position.x,
          vidroLateral1.position.y,
          vidroLateral1.position.z
        );
        matrixVidroLateral1.makeRotationFromEuler(
          new THREE.Euler(
            vidroLateral1.rotation.x,
            vidroLateral1.rotation.y,
            vidroLateral1.rotation.z
          )
        );
        matrixVidroLateral1Array.set(matrixVidroLateral.elements * 16);
      }
    };

    vidroLateral1InstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixVidroLateral1Array, 16)
    );

    this.updateMatrixVidroLateral1();

    vidroTraseiroConvex = this.criaVidroTraseiro();

    const vidroTraseiroInstanceGeometry =
      new THREE.InstancedBufferGeometry().copy(vidroTraseiroConvex);

    vidroTraseiro = new THREE.InstancedMesh(vidroTraseiroConvex, vidroMaterial, numInstances);

    vidroTraseiro.scale.set(scale3, scale3, scale3);
    vidroTraseiro.translateZ(0.95);
    vidroTraseiro.translateX(-0.3);
    vidroTraseiro.rotateX(THREE.MathUtils.degToRad(0));
    vidroTraseiro.rotateY(THREE.MathUtils.degToRad(-11));
    vidroTraseiro.rotateZ(THREE.MathUtils.degToRad(-90));
    teto.add(vidroTraseiro);

    const matrixVidroTraseiro = new THREE.Matrix4();
    const matrixVidroTraseiroArray = new Float32Array(numInstances * 16);

    this.updateMatrixVidroTraseiro = () => {
      for (let i = 0; i < numInstances; i++) {
        matrixVidroTraseiro.identity();
        matrixVidroTraseiro.setPosition(
          vidroTraseiro.position.x,
          vidroTraseiro.position.y,
          vidroTraseiro.position.z
        );
        matrixVidroTraseiro.makeRotationFromEuler(
          new THREE.Euler(
            vidroTraseiro.rotation.x,
            vidroTraseiro.rotation.y,
            vidroTraseiro.rotation.z
          )
        );
        matrixVidroTraseiroArray.set(matrixVidroTraseiro.elements * 16);
      }
    };

    this.updateMatrixVidroTraseiro();

    vidroTraseiroInstanceGeometry.setAttribute(
      "instanceMatrix",
      new THREE.InstancedBufferAttribute(matrixVidroTraseiroArray, 16)
    );

      tampaTraseiraConvex = this.criaTampaTraseira();

      const tampaTraseiraInstanceGeometry = new THREE.InstancedBufferGeometry().copy(tampaTraseiraConvex);
      
      tampaTraseira = new THREE.InstancedMesh(tampaTraseiraConvex, tampaMaterial, numInstances);

      tampaTraseira.scale.set(scale3, scale3, scale3);
      tampaTraseira.translateZ(0.72);
      tampaTraseira.translateX(-1.5);
      tampaTraseira.rotateX(THREE.MathUtils.degToRad(0));
      tampaTraseira.rotateY(THREE.MathUtils.degToRad(-11));
      tampaTraseira.rotateZ(THREE.MathUtils.degToRad(-90));
      teto.add(tampaTraseira);

      const matrixTampaTraseira = new THREE.Matrix4();
      const matrixTampaTraseiraArray = new Float32Array(numInstances * 16);

      this.updateMatrixTampaTraseira = () => {
        for (let i = 0; i < numInstances; i++) {
          matrixTampaTraseira.identity();
          matrixTampaTraseira.setPosition(
            tampaTraseira.position.x,
            tampaTraseira.position.y,
            tampaTraseira.position.z
          );
          matrixTampaTraseira.makeRotationFromEuler(
            new THREE.Euler(
              tampaTraseira.rotation.x,
              tampaTraseira.rotation.y,
              tampaTraseira.rotation.z
            )
          );
          matrixTampaTraseiraArray.set(matrixTampaTraseira.elements * 16);
        }
      };

      this.updateMatrixTampaTraseira();

      tampaTraseiraInstanceGeometry.setAttribute(
        "instanceMatrix",
        new THREE.InstancedBufferAttribute(matrixTampaTraseiraArray, 16)
      );


      this.updateConvexObject = function () {
      tetoInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      vidroFrenteInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      paraChoquefInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      vidroLateralInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      vidroLateral1InstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      vidroTraseiroInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
      tampaTraseiraInstanceGeometry.getAttribute(
        "instanceMatrix"
      ).needsUpdate = true;
    };

    const eixo_tras = this.criarEixo();
    base.add(eixo_tras);

    const eixo_frente = this.criarEixo();
    base.add(eixo_frente);

    eixo_tras.rotateX(THREE.MathUtils.degToRad(90));
    eixo_tras.translateZ(1);
    eixo_tras.translateX(-4);

    eixo_frente.rotateX(THREE.MathUtils.degToRad(90));
    eixo_frente.translateZ(1);
    eixo_frente.translateX(3);

    const calota_tras_direita = this.criarCalota();
    eixo_tras.add(calota_tras_direita);
    calota_tras_direita.translateY(-3);

    const calota_tras_esquerda = this.criarCalota();
    eixo_tras.add(calota_tras_esquerda);
    calota_tras_esquerda.translateY(3);

    const calota_frente_direita = this.criarCalota();
    eixo_frente.add(calota_frente_direita);
    calota_frente_direita.translateY(-3);

    const calota_frente_esquerda = this.criarCalota();
    eixo_frente.add(calota_frente_esquerda);
    calota_frente_esquerda.translateY(3);

    const esfera_tras_direita = this.criarEsfera();
    eixo_tras.add(esfera_tras_direita);
    esfera_tras_direita.translateY(3);

    const esfera_tras_esquerda = this.criarEsfera();
    eixo_tras.add(esfera_tras_esquerda);
    esfera_tras_esquerda.translateY(-3);

    const esfera_frente_direita = this.criarEsfera();
    eixo_frente.add(esfera_frente_direita);
    esfera_frente_direita.translateY(3);

    const esfera_frente_esquerda = this.criarEsfera();
    eixo_frente.add(esfera_frente_esquerda);
    esfera_frente_esquerda.translateY(-3);

    const pneu_tras_direita = this.criarPneu();
    calota_tras_direita.add(pneu_tras_direita);
    pneu_tras_direita.rotateX(THREE.MathUtils.degToRad(90));

    const pneu_tras_esquerda = this.criarPneu();
    calota_tras_esquerda.add(pneu_tras_esquerda);
    pneu_tras_esquerda.rotateX(THREE.MathUtils.degToRad(90));
  

    const pneu_frente_direita = this.criarPneu();
    calota_frente_direita.add(pneu_frente_direita);
    pneu_frente_direita.rotateX(THREE.MathUtils.degToRad(90));

    const pneu_frente_esquerda = this.criarPneu();
    calota_frente_esquerda.add(pneu_frente_esquerda);
    pneu_frente_esquerda.rotateX(THREE.MathUtils.degToRad(90));
    

    this.carro.position.set(inicial[0], inicial[1] + 0.475, inicial[2]);

    this.carro.scale.set(0.15, 0.15, 0.15);

    this.carro.rotateY(Math.PI);

    this.scene.add(this.carro);

    this.aceleracao = 0.0008;

    this.velocidade = 0;

    this.limiteVelocidade = 0.16;

    this.acelerar = () => {
      if (this.velocidade < this.limiteVelocidade) {
        this.velocidade += this.aceleracao;
        this.velocidade = Number(this.velocidade.toFixed(4));
      }
      this.carro.translateX(this.velocidade);
    };

    this.desacelerar = () => {
      if (this.velocidade > 0) {
        this.velocidade -= this.aceleracao;
        this.velocidade = Number(this.velocidade.toFixed(4));
      }
      this.carro.translateX(this.velocidade);
    };

    this.freiar = () => {
      this.velocidade -= this.aceleracao * 3;
      this.velocidade = Number(this.velocidade.toFixed(4));
    };

    this.re = () => {
      if (this.velocidade > 0) this.freiar();
      else {
        if (this.velocidade >= -this.limiteVelocidade / 2.4) {
          this.velocidade -= this.aceleracao;
          this.velocidade = Number(this.velocidade.toFixed(4));
        }
        this.carro.translateX(this.velocidade);
      }
    };

    this.desacelerarRe = () => {
      if (this.velocidade < 0) {
        this.velocidade += this.aceleracao;
        this.velocidade = Number(this.velocidade.toFixed(4));
      }
      this.carro.translateX(this.velocidade);
    };

    this.estaNaPista = (pista) => {
      let posicoesVector3 = [];
      for (let i = 0; i < pista.pista.children.length; i++) {
        posicoesVector3[i] = pista.pista.children[i].position;
        let carroNaPista = posicoesVector3.some((posicaoVector3) => {
          const distanciaLimite = 7;
          let distancia = this.carro.position.distanceTo(posicaoVector3);
          return distancia < distanciaLimite;
        });
        if (carroNaPista) {
          return true;
        }
      }
      return false;
    };

    this.penalidade = (pista) => {
      if (!this.estaNaPista(pista)) {
        this.limiteVelocidade = 0.08;
        if (this.velocidade > this.limiteVelocidade) {
          this.velocidade = this.limiteVelocidade;
        }
      } else {
        this.limiteVelocidade = 0.16;
      }
    };

    this.pause = () => {
      clearInterval(this.cron);
      this.aceleracao = 0;
    };

    this.stop = () => {
      clearInterval(this.cron);
      this.ss = 0;
      this.ms = 0;
      this.mm = 0;
    };

    this.resetPos = () => {
            this.carro.position.set(this.inicial[0], this.inicial[1]+0.475, this.inicial[2]);
            this.carro.rotation.x = 0;
            this.carro.rotation.y = Math.PI;
            this.carro.rotation.z = 0;
      }

    this.reset = () => {
      this.resetPos();
      this.velocidade = 0;
      this.voltas = 0;
      this.tempo[0] = "00:00";
      clearInterval(this.cron);
      this.ms = 0;
      this.ss = 0;
      this.mm = 0;
      this.start();
    };

    this.start = () => {
      this.cron = setInterval(() => {
        this.time();
      }, this.temp);
    };

    this.time = () => {
      this.ms++;

      if (this.ms == 60) {
        this.ms = 0;
        this.ss++;
        if (this.ss == 60) {
          this.ss = 0;
          this.mm++;
        }
      }

      let format =
        (this.mm < 10 ? "0" + this.mm : this.mm) +
        ":" +
        (this.ss < 10 ? "0" + this.ss : this.ss) +
        ":" +
        (this.ms < 10 ? "0" + this.ms : this.ms);

      this.tempo[0] = format;
    };

    this.resetVolta = () => {
      clearInterval(this.cronVolta);
      this.msV = 0;
      this.ssV = 0;
      this.mmV = 0;
      this.startVolta();
    };

    this.startVolta = () => {
      this.cronVolta = setInterval(() => {
        this.timeVolta();
      }, this.tempVolta);
    };

    this.timeVolta = () => {
      this.msV++;

      if (this.msV == 60) {
        this.msV = 0;
        this.ssV++;
        if (this.ssV == 60) {
          this.ssV = 0;
          this.mmV++;
        }
      }

      let formatV =
        (this.mmV < 10 ? "0" + this.mmV : this.mmV) +
        ":" +
        (this.ssV < 10 ? "0" + this.ssV : this.ssV) +
        ":" +
        (this.msV < 10 ? "0" + this.msV : this.msV);

      this.tempoV[0] = formatV;
    };

    this.keyboardUpdate = (camMode) => {
      let angle = THREE.MathUtils.degToRad(5);
      let maxRotation = Math.PI / 6;
      this.keyboard.update(camMode);

      if (camMode === 0 || camMode === 1) {
        

        if (this.keyboard.pressed("X")) this.acelerar();
        else this.desacelerar();
        if (this.keyboard.pressed("down")) this.re();
        else this.desacelerarRe();

        if (this.keyboard.pressed("left")) {
          if (this.velocidade > 0) this.carro.rotateY(angle / 4);
          else if (this.velocidade < 0) this.carro.rotateY(-angle / 4);
          if (calota_frente_direita.rotation.z >= -maxRotation) {
            calota_frente_direita.rotateZ(-angle / 2);
            calota_frente_esquerda.rotateZ(-angle / 2);
          }
        } else if (this.keyboard.pressed("right")) {
          if (this.velocidade > 0) this.carro.rotateY(-angle / 4);
          else if (this.velocidade < 0) this.carro.rotateY(angle / 4);
          if (calota_frente_direita.rotation.z <= maxRotation) {
            calota_frente_direita.rotateZ(angle / 2);
            calota_frente_esquerda.rotateZ(angle / 2);
          }
        } else {
          if (calota_frente_direita.rotation.z != 0) {
            if (calota_frente_direita.rotation.z > 0) {
              calota_frente_direita.rotateZ(-angle / 2);
              calota_frente_esquerda.rotateZ(-angle / 2);
            } else {
              calota_frente_direita.rotateZ(angle / 2);
              calota_frente_esquerda.rotateZ(angle / 2);
            }
          }
        }
      } else if (camMode === 2) {
        if (this.keyboard.pressed("X")) {
          pneu_frente_direita.rotateZ(1);
          pneu_frente_esquerda.rotateZ(1);
          pneu_tras_direita.rotateZ(1);
          pneu_tras_esquerda.rotateZ(1);
          calota_frente_direita.rotation.y -= 0.1;
          calota_frente_esquerda.rotation.y -= 0.1;
          calota_tras_direita.rotation.y -= 0.1;
          calota_tras_esquerda.rotation.y -= 0.1;
        }else{
          calota_frente_direita.rotation.y = 0;
          calota_frente_esquerda.rotation.y = 0;
        }
        if (this.keyboard.pressed("right")) {
          if (calota_frente_direita.rotation.z >= -maxRotation) {
            calota_frente_direita.rotateZ(-angle / 2);
            calota_frente_esquerda.rotateZ(-angle / 2);
          }
        } else if (this.keyboard.pressed("left")) {
          if (calota_frente_direita.rotation.z <= maxRotation) {
            calota_frente_direita.rotateZ(angle / 2);
            calota_frente_esquerda.rotateZ(angle / 2);
          }
        } else {
          if (calota_frente_direita.rotation.z.toFixed(1) != 0) {
            if (calota_frente_direita.rotation.z > 0) {
              console.log(calota_frente_direita.rotation.z);
              calota_frente_direita.rotateZ(-angle / 2);
              calota_frente_esquerda.rotateZ(-angle / 2);
            } else {
              calota_frente_direita.rotateZ(angle / 2);
              calota_frente_esquerda.rotateZ(angle / 2);
            }
          }
        }
      }
    };
  }
}
// let scene, renderer, camera, material, light, orbit; // Initial variables
// scene = new THREE.Scene();    // Create main scene
// renderer = initRenderer();    // Init a basic renderer
// camera = initCamera(new THREE.Vector3(0, 10, 10)); // Init camera in this position
// material = setDefaultMaterial(); // create a basic material
// //light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
// orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// let lightColor = "rgb(255,255,255)";
// let lightPosition = new THREE.Vector3(0, 50.0, -20);
// let dirLight = new THREE.DirectionalLight(lightColor);

// dirLight.position.copy(lightPosition)
// dirLight.castShadow = true;
// dirLight.shadow.mapSize.width = 512;
// dirLight.shadow.mapSize.height = 512;
// dirLight.shadow.camera.near = 1;
// dirLight.shadow.camera.far = 200;
// dirLight.shadow.camera.left = -50;
// dirLight.shadow.camera.right = 50;
// dirLight.shadow.camera.top = 50;
// dirLight.shadow.camera.bottom = -50;
// dirLight.name = "Direction Light";

// scene.add(dirLight);

// let ambientColor = "rgb(50,50,50)";
// let ambientLight = new THREE.AmbientLight(ambientColor);
// scene.add(ambientLight)

// let carro = new Carro(scene, camera);
// render();
//     function render()
//     {
//         renderer.render(scene, camera);
//         requestAnimationFrame(render);
//         carro.updateConvexObject();

//     }
