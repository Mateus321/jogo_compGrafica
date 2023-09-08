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
        this.checkpointsVisitados = [];
        this.voltas = 0;

        this.criaChassi = function(){
            let caixa = new THREE.BoxGeometry(10, 2, 5);
            const material_carro = new THREE.MeshPhongMaterial( {color: 0xF0130A });
            let chassi = new THREE.Mesh(caixa, material_carro);
            return chassi;
        }

        this.criarEixo = function (){
            const eixosC = new THREE.CylinderGeometry( 0.5, 0.5, 6, 24 );
            const material_eixos = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
            const eixo = new THREE.Mesh(eixosC, material_eixos);
            return eixo;
        }

        this.criarEsfera = () => {
            const geometria_esfera = new THREE.SphereGeometry(0.6, 32, 16);
            const material_esfera = new THREE.MeshPhongMaterial ( {color: 0xE3EFDF })
            const esfera = new THREE.Mesh(geometria_esfera, material_esfera);
            return esfera;
        }

        this.criarCalota = function (){
            const calotaS = new THREE.CylinderGeometry(0.5, 0.1, 0.2, 24); 
            const material_calota = new THREE.MeshPhongMaterial({color: 0xE3EFDF });
            const calota = new THREE.Mesh(calotaS, material_calota);
            return calota;
        }
        this.criarPneu = function(){
            const rodas = new THREE.TorusGeometry( 0.8, 0.4, 16, 50 ); 
            const material_rodas = new THREE.MeshPhongMaterial( { color: 0x000 } );
            const roda = new THREE.Mesh(rodas, material_rodas);
            return roda;
        }

        this.criaAerofolio = () => {
            const geometria_aerofolio = new THREE.BoxGeometry (1,0.8,7);
            const material_aerofolio = new THREE.MeshPhongMaterial ( {color: 0XF0130A });
            const aerofolio = new THREE.Mesh(geometria_aerofolio, material_aerofolio);
            return aerofolio;
        }

        this.carro = new THREE.Object3D();


        const chassi = this.criaChassi();
        this.carro.add(chassi);

        const aerofolio = this.criaAerofolio();
        this.carro.add(aerofolio);
        aerofolio.translateX(5);
        aerofolio.translateY(1);

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

        const esfera_frente_direita = this.criarEsfera();
        eixo_frente.add(esfera_frente_direita);
        esfera_frente_direita.translateY(3);

        const esfera_frente_esquerda = this.criarEsfera();
        eixo_frente.add(esfera_frente_esquerda);
        esfera_frente_esquerda.translateY(-3);

        const esfera_tras_direita = this.criarEsfera();
        eixo_tras.add(esfera_tras_direita);
        esfera_tras_direita.translateY(3);

        const esfera_tras_esquerda = this.criarEsfera();
        eixo_tras.add(esfera_tras_esquerda);
        esfera_tras_esquerda.translateY(-3);


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

        this.aceleracao = -0.0008;
        
        this.velocidade = 0;

        this.limiteVelocidade = -0.24;

        this.acelerar = () =>{
            if(this.velocidade > this.limiteVelocidade){
                this.velocidade += this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(3));
            }
            this.carro.translateX(this.velocidade);
        }

        this.desacelerar = () =>{
            if(this.velocidade < 0){
                this.velocidade -= this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(3));
                }
            this.carro.translateX(this.velocidade);
        }

        this.freiar = () => {
         this.velocidade -= this.aceleracao*3;
         this.velocidade = Number(this.velocidade.toFixed(3));
        }

        this.re = () => {
            if(this.velocidade < 0) this.freiar();
            else{
                if(this.velocidade <= -this.limiteVelocidade/2.4){
                    this.velocidade -= this.aceleracao;
                    this.velocidade = Number(this.velocidade.toFixed(3));
                }
                this.carro.translateX(this.velocidade);
            }
        }

        this.desacelerarRe = () =>{
            if(this.velocidade > 0){
                this.velocidade += this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(3));
                }
            this.carro.translateX(this.velocidade);
        }

        this.getPos = () => {
            let posicao = [];
            posicao.push(this.carro.position.x);
            posicao.push(this.carro.position.y);
            posicao.push(this.carro.position.z);
            return posicao;
        }


        this.keyboardUpdate = () => {

            let angle = THREE.MathUtils.degToRad(5);
            let maxRotation = Math.PI / 6;

            this.keyboard.update();
          
            if ( this.keyboard.pressed("X") ) this.acelerar();
            else this.desacelerar();
            if ( this.keyboard.pressed("down") )  this.re();
            else this.desacelerarRe();
          
            if ( this.keyboard.pressed("left") ){ 
                if(this.velocidade != 0) this.carro.rotateY(  angle/4 );
                if(calota_frente_direita.rotation.z >= -maxRotation){
                calota_frente_direita.rotateZ(-angle/2);
                calota_frente_esquerda.rotateZ(-angle/2);
                }
            }  
            else if ( this.keyboard.pressed("right") ){
                if(this.velocidade != 0) this.carro.rotateY( -angle/4 );
                if(calota_frente_direita.rotation.z <= maxRotation){
                calota_frente_direita.rotateZ(angle/2);
                calota_frente_esquerda.rotateZ(angle/2);
                }
            }else{
                if(calota_frente_direita.rotation.z != 0){
                    if(calota_frente_direita.rotation.z > 0){
                        calota_frente_direita.rotateZ(-angle/2);
                        calota_frente_esquerda.rotateZ(-angle/2);
                    }else{
                        calota_frente_direita.rotateZ(angle/2);
                        calota_frente_esquerda.rotateZ(angle/2);
                    }
                }
            }
          }   
    }
}
        




