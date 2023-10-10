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
import { ConvexGeometry } from '../build/jsm/geometries/ConvexGeometry.js';
import { BoxGeometry } from '../build/three.module.js';

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

        this.materialCarro = new THREE.MeshPhongMaterial( {color: 0xF0130A });

        this.checkpointsVisitados = [];
        this.voltas = 0;
        this.temp = 1;
        this.cron;
        this.ms = 0;
        this.mm = 0;
        this.ss = 0;
        this.tempo = [''];

        this.tempVolta = 1;
        this.cronVolta;
        this.msV = 0;
        this.mmV = 0;
        this.ssV = 0;
        this.tempoV = [''];


        this.carro = new THREE.Object3D();

        this.criaBase = function(){
            const baseGeometry = new BoxGeometry(2,1 ,1);
            const base = new THREE.Mesh(baseGeometry, this.materialCarro);
            return base;
        }

        this.paraChoqueFrente = function(){
            var paraChoqueF = []

            paraChoqueF.push(new THREE.Vector3(1,0.5,0.8));
            paraChoqueF.push(new THREE.Vector3(1,-0.5,0.8));
            paraChoqueF.push(new THREE.Vector3(0.8,1,1));
            paraChoqueF.push(new THREE.Vector3(0.8,-1,1));
            paraChoqueF.push(new THREE.Vector3(1,0.5,0.2));
            paraChoqueF.push(new THREE.Vector3(1,-0.5,0.2));
            paraChoqueF.push(new THREE.Vector3(0.8,1,0));
            paraChoqueF.push(new THREE.Vector3(0.8,-1,0));
            
            return paraChoqueF;
        }

        this.paraChoqueTras = function(){
            var paraChoqueT = []

            paraChoqueT.push(new THREE.Vector3(-1,1,1));
            paraChoqueT.push(new THREE.Vector3(-1,-1,1));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,1));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,0));
            paraChoqueT.push(new THREE.Vector3(-0.6,1,0));
            paraChoqueT.push(new THREE.Vector3(-0.6,-1,0));

            return paraChoqueT;
        }
    /*
        A=(2,1,1)
        (-2,1,1)
        C=(2,-1,1)
        D=(-2,-1,1)
        E=(0.5,1,1.5)
        F=(0.5,-1,1.5)
    */




        this.updateConvexObject = function(){
            
        }

        this.carro.position.set(inicial[0], inicial[1]+0.475, inicial[2]);
        this.carro.scale.set(0.15,0.15,0.15);

        this.scene.add(this.carro);

        this.aceleracao = -0.0008;
        
        this.velocidade = 0;

        this.limiteVelocidade = -0.16;

        this.acelerar = () =>{
            if(this.velocidade > this.limiteVelocidade){
                this.velocidade += this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(4));
            }
            this.carro.translateX(this.velocidade);
        }

        this.desacelerar = () =>{
            if(this.velocidade < 0){
                this.velocidade -= this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(4));
                }
            this.carro.translateX(this.velocidade);
        }

        this.freiar = () => {
         this.velocidade -= this.aceleracao*3;
         this.velocidade = Number(this.velocidade.toFixed(4));
        }
        

        this.re = () => {
            if(this.velocidade < 0) this.freiar();
            else{
                if(this.velocidade <= -this.limiteVelocidade/2.4){
                    this.velocidade -= this.aceleracao;
                    this.velocidade = Number(this.velocidade.toFixed(4));
                }
                this.carro.translateX(this.velocidade);
            }
        }

        this.desacelerarRe = () => {
            if(this.velocidade > 0){
                this.velocidade += this.aceleracao;
                this.velocidade = Number(this.velocidade.toFixed(4));
                }
            this.carro.translateX(this.velocidade);
        }

        this.estaNaPista = (pista) => {
            let posicoesVector3 = []
            for(let i = 0; i < pista.pista.children.length; i++){
                posicoesVector3[i] = pista.pista.children[i].position;
                let carroNaPista = posicoesVector3.some((posicaoVector3) => {
                    const distanciaLimite = 7;
                    let distancia = this.carro.position.distanceTo(posicaoVector3);
                    return distancia < distanciaLimite
                });
                if(carroNaPista){
                    return true;
                    
                } 
            }
            return false;  
        }

        this.penalidade = (pista) => {
            if(!this.estaNaPista(pista)){
            this.limiteVelocidade = -0.08;
            if(this.velocidade < this.limiteVelocidade){
                this.velocidade = this.limiteVelocidade;
            }
            }else{
                this.limiteVelocidade = -0.16;
            }
        }

        this.pause = () => {
            clearInterval(this.cron);
            this.aceleracao = 0;
        }

        this.stop = () => {
            clearInterval(this.cron);
            this.ss = 0;
            this.ms = 0;
            this.mm = 0;
        }

        this.resetPos = () => {
            this.carro.position.set(inicial[0], inicial[1]+0.475, inicial[2]);
            this.carro.rotation.x = 0;
            this.carro.rotation.y = 0;
            this.carro.rotation.z = 0;
        }

        this.reset = () => {
            this.resetPos();
            this.velocidade = 0;
            this.voltas = 0;
            this.tempo[0] = "00:00"
            clearInterval(this.cron);
            this.ms = 0;
            this.ss = 0;
            this.mm = 0;
            this.start();
        }   
        
        this.start = () => {
            this.cron = setInterval(() => {this.time()}, this.temp);
        } 

        this.time = ( ) => {
            this.ms++;
          
            if(this.ms == 60)
            {
              this.ms = 0;
              this.ss++;
              if(this.ss == 60){
                this.ss = 0;
                this.mm++;
                
              }
            }
            
            let format = (this.mm < 10 ? '0' + this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss) + ':' + (this.ms < 10 ? '0' + this.ms : this.ms);
            
            this.tempo[0] = format;
          }

          this.resetVolta = () => {
            clearInterval(this.cronVolta);
            this.msV = 0;
            this.ssV = 0;
            this.mmV = 0;
            this.startVolta(); 
        }   
        
        this.startVolta = () => {
            this.cronVolta = setInterval(() => {this.timeVolta()}, this.tempVolta);
        } 

        this.timeVolta = ( ) => {
            this.msV++;
          
            if(this.msV == 60)
            {
              this.msV = 0;
              this.ssV++;
              if(this.ssV == 60){
                this.ssV = 0;
                this.mmV++;
                
              }
            }
            
            let formatV = (this.mmV < 10 ? '0' + this.mmV : this.mmV) + ':' + (this.ssV < 10 ? '0' + this.ssV : this.ssV) + ':' + (this.msV < 10 ? '0' + this.msV : this.msV);
            
            this.tempoV[0] = formatV;
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
                if(this.velocidade < 0) this.carro.rotateY(  angle/4 );
                else if(this.velocidade > 0) this.carro.rotateY( -angle/4 );
                if(calota_frente_direita.rotation.z >= -maxRotation){
                calota_frente_direita.rotateZ(-angle/2);
                calota_frente_esquerda.rotateZ(-angle/2);
                }
            }  
            else if ( this.keyboard.pressed("right") ){
                if(this.velocidade < 0) this.carro.rotateY( -angle/4 );
                else if(this.velocidade > 0) this.carro.rotateY( angle/4 );
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
        




