import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { Pista } from './pistaarray.js';

import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        SecondaryBox,        
        onWindowResize, 
        createGroundPlaneXZ} from "../libs/util/util.js";

// Listen window size changes

// Use to scale the cube
var scale = 1.0;

// Show text information onscreen


// To use the keyboard


// Show axes (parameter is size of each axis)

// create the ground plane
// scene.add(plane);




export class Carro {
    constructor(scene, inicial, keyboard) {
        this.scene = scene
        this.inicial = inicial;
        this.keyboard = keyboard;

        this.criaChassi = function(){
            let caixa = new THREE.BoxGeometry(10, 2, 5);
            const material_carro = new THREE.MeshBasicMaterial( {color: 0xF0130A });
            let chassi = new THREE.Mesh(caixa, material_carro);
            return chassi;
        }

        this.criarEixo = function (){
            const eixosC = new THREE.CylinderGeometry( 0.5, 0.5, 6, 24 );
            const material_eixos = new THREE.MeshBasicMaterial( { color: 0xCCCCCC } ); 
            const eixo = new THREE.Mesh(eixosC, material_eixos);
            return eixo;
        }

        this.criarEsfera = () => {
            const geometria_esfera = new THREE.SphereGeometry(0.6, 32, 16);
            const material_esfera = new THREE.MeshBasicMaterial ( {color: 0xE3EFDF })
            const esfera = new THREE.Mesh(geometria_esfera, material_esfera);
            return esfera;
        }

        this.criarCalota = function (){
            const calotaS = new THREE.CylinderGeometry(0.5, 0.1, 0.2, 24); 
            const material_calota = new THREE.MeshBasicMaterial({color: 0xE3EFDF });
            const calota = new THREE.Mesh(calotaS, material_calota);
            return calota;
        }
        this.criarPneu = function(){
            const rodas = new THREE.TorusGeometry( 0.8, 0.4, 16, 50 ); 
            const material_rodas = new THREE.MeshBasicMaterial( { color: 0x000 } );
            const roda = new THREE.Mesh(rodas, material_rodas);
            return roda;
        }

        this.carro = new THREE.Object3D();


        const chassi = this.criaChassi();
        this.carro.add(chassi);

        const eixo_frente = this.criarEixo();
        chassi.add(eixo_frente);

        const eixo_tras = this.criarEixo();
        chassi.add(eixo_tras);

        eixo_frente.rotateX(THREE.MathUtils.degToRad(90));
        eixo_frente.translateZ(1);
        eixo_frente.translateX(-4);

        eixo_tras.rotateX(THREE.MathUtils.degToRad(90));
        eixo_tras.translateZ(1);
        eixo_tras.translateX(4);

        const calota_frente_direita = this.criarCalota();
        eixo_frente.add(calota_frente_direita);
        calota_frente_direita.translateY(-3);

        const calota_frente_esquerda = this.criarCalota();
        eixo_frente.add(calota_frente_esquerda);
        calota_frente_esquerda.translateY(3);

        const calota_tras_direita = this.criarCalota();
        eixo_tras.add(calota_tras_direita);
        calota_tras_direita.translateY(-3);

        const calota_tras_esquerda = this.criarCalota();
        eixo_tras.add(calota_tras_esquerda);
        calota_tras_esquerda.translateY(3);

        const esfera_direita = this.criarEsfera();
        eixo_frente.add(esfera_direita);
        esfera_direita.translateY(3);

        const esfera_esquerda = this.criarEsfera();
        eixo_frente.add(esfera_esquerda);
        esfera_esquerda.translateY(-3);


        const pneu_frente_direita = this.criarPneu();
        calota_frente_direita.add(pneu_frente_direita);
        pneu_frente_direita.rotateX(THREE.MathUtils.degToRad(90));

        const pneu_frente_esquerda = this.criarPneu();
        calota_frente_esquerda.add(pneu_frente_esquerda);
        pneu_frente_esquerda.rotateX(THREE.MathUtils.degToRad(90));

        const pneu_tras_direita = this.criarPneu();
        calota_tras_direita.add(pneu_tras_direita);
        pneu_tras_direita.rotateX(THREE.MathUtils.degToRad(90));

        const pneu_tras_esquerda = this.criarPneu();
        calota_tras_esquerda.add(pneu_tras_esquerda);
        pneu_tras_esquerda.rotateX(THREE.MathUtils.degToRad(90));

        this.carro.position.set(inicial[0], inicial[1]+0.58, inicial[2]);
        this.carro.scale.set(0.2,0.2,0.2);

        this.scene.add(this.carro);

        this.keyboardUpdate = () => {

            let angle = THREE.MathUtils.degToRad(5);

            this.keyboard.update();
          
            if ( this.keyboard.pressed("X") ){
                this.carro.translateX(-0.1);
                eixo_frente.rotateY(angle);
            }    
            if ( this.keyboard.pressed("down") )  this.carro.translateX( 0.1 );
          
            
            let maxRotationP = Math.PI / 4;
            if ( this.keyboard.pressed("left") ){ 
                if(this.keyboard.pressed("X")) this.carro.rotateY(  angle/4 );
              esfera_direita.rotateY(-angle/2);
              esfera_esquerda.rotateY(-angle/2);
            }  
            if ( keyboard.pressed("right") ){
                if(this.keyboard.pressed("X")) this.carro.rotateY( -angle/4 );
              esfera_direita.rotateY(angle/2);
              esfera_esquerda.rotateY(angle/2);
            }
          }   
    }
}
        




