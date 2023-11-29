import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import setMaterial from './main.js';

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
  },
  { id: 3,
    posicoes: [[0.0, 0.0, 30.0],
                [0.0,0.0, 10.0],
                [0.0,0.0, 0.0],
                [10.0,0.0, 0.0],
                [20.0,0.0, 0.0],
                [30.0,0.0, 0.0],
                [40.0,0.0, 0.0],
                [50.0,0.0, 0.0],
                [60.0,0.0, 0.0],
                [70.0,0.0, 0.0],
                [80.0,0.0, 0.0],
                [80.0,0.0, 10.0],
                [80.0,0.0, 20.0],
                [80.0,0.0, 30.0],
                [20.0,0.0, 10.0],
                [20.0,0.0, 20.0],
                [20.0,0.0, 30.0],
                [30.0,0.0, 30.0],
                [40.0,0.0, 30.0],
                [50.0,0.0, 30.0],
                [60.0,0.0, 30.0],
                [70.0,0.0, 30.0],
                [80.0,0.0, 30.0],
                [80.0,0.0, 40.0],
                [80.0,0.0, 50.0],
                [80.0,0.0, 60.0],
                [80.0,0.0, 70.0],
                [80.0,0.0, 80.0],
                [70.0,0.0, 80.0],
                [60.0,0.0, 80.0],
                [50.0,0.0, 80.0],
                [40.0,0.0, 80.0],
                [40.0,0.0, 70.0],
                [40.0,0.0, 60.0],
                [30.0,0.0, 60.0],
                [20.0,0.0, 60.0],
                [10.0,0.0, 60.0],
                [0.0,0.0, 60.0],
                [0.0,0.0, 50.0],
                [0.0,0.0, 40.0],
                [0.0,0.0, 20.0],

  ],
  checkpoints:  [new THREE.Vector3(0.0,0.0,0.0),
                 new THREE.Vector3(80.0,0.0,30.0),
                 new THREE.Vector3(80.0,0.0,80.0),
                 new THREE.Vector3(30.0,0.0,60.0),
                 new THREE.Vector3(0.0,0.0,20.0)] 
                },

  { id: 4, 
    posicoes: [[60.0, 0.0, 80.0],
    [80.0,0.0, 80.0],
    [70.0,0.0, 80.0],
    [50.0,0.0, 80.0],
    [50.0,0.0, 70.0],
    [50.0,0.0, 60.0],
    [50.0,0.0, 50.0],
    [50.0,0.0, 40.0],
    [50.0,0.0, 30.0],
    [40.0,0.0, 30.0],
    [30.0,0.0, 30.0],
    [20.0,0.0, 30.0],
    [10.0,0.0, 30.0],
    [10.0,0.0, 30.0],
    [10.0,0.0, 30.0],
    [10.0,0.0, 20.0],
    [10.0,0.0, 10.0],
    [20.0,0.0, 10.0],
    [30.0,0.0, 10.0],
    [30.0,0.0, 20.0],
    [30.0,0.0, 30.0],
    [30.0,0.0, 40.0],
    [30.0,0.0, 50.0],
    [40.0,0.0, 50.0],
    [50.0,0.0, 50.0],
    [60.0,0.0, 50.0],
    [70.0,0.0, 50.0],
    [80.0,0.0, 50.0],
    [80.0,0.0, 60.0],
    [80.0,0.0, 70.0],
              ],
  checkpoints:  [
                 new THREE.Vector3(50.0,0.0,30.0),
                 new THREE.Vector3(10.0,0.0,30.0),
                 new THREE.Vector3(30.0,0.0,30.0),
                 new THREE.Vector3(30.0,0.0,50.0), 
                 new THREE.Vector3(80.0,0.0,50.0), 
                 new THREE.Vector3(80.0,0.0,80.0),
                 new THREE.Vector3(50.0,0.0,80.0)] 
  }
]


export class Pista {
  constructor(id, posicoes, checkpoints, scene) {
    this.id = id;
    this.posicoes = posicoes;
    this.scene = scene;
    this.checkpoints = checkpoints;

    this.proximoCheckpoint = 0;
                   

    // const materialInicial = new THREE.MeshPhongMaterial( {color: 0xe85907});
    const materialInicial = setMaterial('../assets/textures/start.jpg', 0.3, 0.3);

    const cubeGeometry = new THREE.BoxGeometry(10, 0.3, 10);


    const material = new THREE.MeshPhongMaterial({color: 0x262729});
    const texturasPista = [setMaterial('../assets/textures/cement.jpg', 2, 4),
    setMaterial('../assets/textures/asfalto.jpg', 2, 4),
    setMaterial('../assets/textures/Pebbles/Pebbles_002_COLOR.jpg', 2, 4),
    setMaterial('../assets/textures/NormalMapping/brickwall.jpg', 4, 2)];

    this.pista = new THREE.Object3D();

    this.posicoes.forEach((element, index) => {
      if(index == 0){
        let bloco = new THREE.Mesh(cubeGeometry, materialInicial);
        bloco.position.set(element[0],element[1],element[2]);
        bloco.receiveShadow = true;
        this.pista.add(bloco);
      }else{
        let bloco = new THREE.Mesh(cubeGeometry, texturasPista[this.id - 1]);
        bloco.position.set(element[0],element[1],element[2]);
        bloco.receiveShadow = true;
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
    
    var faceArray = [];
    var textureFront = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/negz.jpg');
    var textureBack = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/posz.jpg');
    var textureTop = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/posy.jpg');
    textureTop.rotation = THREE.MathUtils.degToRad(-90);
    textureTop.center = new THREE.Vector2(0.5, 0.5);
    var textureBottom = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/negy.jpg');
    textureBottom.rotation = THREE.MathUtils.degToRad(-90);
    textureBottom.center = new THREE.Vector2(0.5, 0.5);
    var textureRight = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/posx.jpg');
    var textureLeft = new THREE.TextureLoader().load( '../assets/textures/cube/Bridge/negx.jpg');
      
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureFront }));
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureBack }));
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureTop }));
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureBottom }));
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureRight }));
    faceArray.push(new THREE.MeshBasicMaterial( { map: textureLeft }));
       
    for (var i = 0; i < 6; i++)
      faceArray[i].side = THREE.BackSide;
       
    var skyboxGeometry = new THREE.BoxGeometry( 1000, 1000, 1000);
    var skybox = new THREE.Mesh( skyboxGeometry, faceArray );
    // skybox.rotateX(degreesToRadians(90));
    scene.add( skybox );


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






