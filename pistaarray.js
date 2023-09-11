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
  { id: 1, 
    posicoes: [[20.0, 0.0, 40.0],
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
  ],
  checkpoints:  [new THREE.Vector3(10.0,0.0,40.0),
                 new THREE.Vector3(0.0,0.0,0.0),
                 new THREE.Vector3(40.0,0.0,0.0),
                 new THREE.Vector3(40.0,0.0,40.0),
                 new THREE.Vector3(10.0,0.0,40.0)]
  },
  { id: 2, 
    posicoes: [[20.0, 0.0, 40.0],
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
  ],
  checkpoints:  [new THREE.Vector3(10.0,0.0,40.0),
                 new THREE.Vector3(0.0,0.0,0.0),
                 new THREE.Vector3(20.0,0.0,20.0),
                 new THREE.Vector3(40.0,0.0,20.0),
                 new THREE.Vector3(10.0,0.0,40.0)] 
                }
]


export class Pista {
  constructor(id, posicoes, checkpoints, scene) {
    this.id = id;
    this.posicoes = posicoes;
    this.scene = scene;
    this.checkpoints = checkpoints;

    this.proximoCheckpoint = 0;
                   

    const materialInicial = new THREE.MeshPhongMaterial( {color: 0xe85907});

    const cubeGeometry = new THREE.BoxGeometry(10, 0.3, 10);


    const material = new THREE.MeshPhongMaterial({color: 0x262729});

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

    this.removePista = () => {
      for( let i = this.pista.children.length - 1; i >=0 ;i--){
        let obj = this.pista.children[i];
        this.pista.remove(obj);
      }
      this.scene.remove(this.pista);
    }

    this.proximoCheckpointVisitado = (carro) => {
      if(this.proximoCheckpoint < this.checkpoints.length){
      const proximo = this.checkpoints[this.proximoCheckpoint];
      const distancia = carro.carro.position.distanceTo(proximo);
      const distanciaLimite = 10.0;
      if (distancia < distanciaLimite) {
        carro.checkpointsVisitados.push(proximo);
        this.proximoCheckpoint++;
        return true;
        }
      }
      return false;
    }
    
    this.checkpointsVisitados = (carro) => {
      this.proximoCheckpointVisitado(carro);
      return this.checkpoints.every((checkpoint) => { 
        return carro.checkpointsVisitados.includes(checkpoint);
      })
    }
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






