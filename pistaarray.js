import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

// Listen window size changes

// Show axes (parameter is size of each axis)

// create the ground plane
export const listaPistas = [
  { id: 1, posicoes: [[20.0, 0.0, 40.0],
                      [40.0, 0.0, 20.0],
                      [20.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0],
                      [10.0, 0.0, 0.0],
                      [30.0, 0.0, 0.0],
                      [40.0, 0.0, 0.0],
                      [40.0, 0.0, 10.0],
                      [40.0, 0.0, 30.0],
                      [40.0, 0.0, 40.0],
                      [30.0, 0.0, 40.0],
                      [10.0, 0.0, 40.0],
                      [0.0, 0.0, 40.0],
                      [0.0, 0.0, 30.0],
                      [0.0, 0.0, 20.0],
                      [0.0, 0.0, 10.0],
  ] },
  { id: 2, posicoes: [[20.0, 0.0, 40.0],
                      [40.0, 0.0, 20.0],
                      [20.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0],
                      [10.0, 0.0, 0.0],
                      [20.0, 0.0, 10.0],
                      [20.0, 0.0, 20.0],
                      [30.0, 0.0, 20.0],
                      [40.0, 0.0, 30.0],
                      [40.0, 0.0, 40.0],
                      [30.0, 0.0, 40.0],
                      [10.0, 0.0, 40.0],
                      [0.0, 0.0, 40.0],
                      [0.0, 0.0, 30.0],
                      [0.0, 0.0, 20.0],
                      [0.0, 0.0, 10.0],
  ] }
]

export class Pista {
  constructor(id, posicoes, scene) {
    this.id = id;
    this.posicoes = posicoes;
    this.scene = scene;


    const materialInicial = new THREE.MeshBasicMaterial( {color: 0xe85907});

    const cubeGeometry = new THREE.BoxGeometry(10, 0.3, 10);


    const material = new THREE.MeshBasicMaterial( {color: 0x262729});

    this.pista = new THREE.Object3D();

      this.posicoes.forEach((element, index) => {
        if(index == 0){
          let bloco = new THREE.Mesh(cubeGeometry, materialInicial);
          bloco.position.set(element[0],element[1],element[2]);
          this.pista.add(bloco);
        }else{
          let bloco = new THREE.Mesh(cubeGeometry, material);
          bloco.position.set(element[0],element[1],element[2]);
          this.pista.add(bloco);
        }
      });

      this.getInicial = () => {
        return this.posicoes[0];
      }
      
      this.scene.add(this.pista);
      

    }
    
  } 



  

  // const pista = new THREE.Object3D();

  // listaPistas[0].posicoes.forEach((element, index) => {
  //   if(index == 0){
  //     let bloco = new THREE.Mesh(cubeGeometry, materialInicial);
  //     bloco.position.set(element[0],element[1],element[2]);
  //     pista.add(bloco);
  //   }else{
  //     let bloco = new THREE.Mesh(cubeGeometry, material);
  //     bloco.position.set(element[0],element[1],element[2]);
  //     pista.add(bloco);
  //   }
  // });
  
  // listaPistas[1].posicoes.forEach((element, index) => {
  //   if(index == 0){
  //     let bloco = new THREE.Mesh(cubeGeometry, materialInicial);
  //     bloco.position.set(element[0],element[1],element[2]);
  //     pista.add(bloco);
  //   }else{
  //     let bloco = new THREE.Mesh(cubeGeometry, material);
  //     bloco.position.set(element[0],element[1],element[2]);
  //     pista.add(bloco);
  //   }
  // });






