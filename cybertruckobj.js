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
import { BoxGeometry, Scene } from '../build/three.module.js';
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
var vidroFrente = null;
let castShadow = true;
let objectVisibility = true;
let objOpacity = 0.01;

// To use the keyboard


// Show axes (parameter is size of each axis)

// create the ground plane
// scene.add(plane);
var estruturaMaterial = new THREE.MeshPhongMaterial({
    color: 0xD9F7DB,
  opacity: objOpacity,
  transparent: false
});

var vidroMaterial = new THREE.MeshPhongMaterial({
    color: 0x656465,
    opacity: objOpacity,
    transparent: true
    
});



export class Carro {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        //this.inicial = inicial;
        //this.keyboard = keyboard;

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

        this.castShadow = true;
        this.objectVisibility = true;

        this.carro = new THREE.Object3D();

        this.criaBase = function(){
            const baseGeometry = new BoxGeometry(12, 2.6, 5.5);
            const base = new THREE.Mesh(baseGeometry, estruturaMaterial);
            base.castShadow = castShadow;
            base.objectVisibility = objectVisibility;
            return base;
        }



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

        this.criarEixo = function (){
            const eixosC = new THREE.CylinderGeometry( 0.2, 0.2, 6, 24 );
            const material_eixos = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
            const eixo = new THREE.Mesh(eixosC, material_eixos);
            return eixo;
        }

        this.criarEsfera = () => {
            const geometria_esfera= new THREE.CylinderGeometry(0.8, 0.8, 0.6, 8); 
            const material_esfera= new THREE.MeshPhongMaterial({color: 0xE3EFDF });
            const esfera = new THREE.Mesh(geometria_esfera,  material_esfera);
            return esfera;
        }

        this.criarCalota = function (){
            const calotaS = new THREE.SphereGeometry(0.1, 32, 16);
            const material_calota = new THREE.MeshPhongMaterial ( {color: 0xE3EFDF })
            const calota= new THREE.Mesh( calotaS, material_calota);
            return calota;

           
        }
        this.criarPneu = function(){
            const rodas = new THREE.TorusGeometry( 0.8, 0.3, 16, 50 ); 
            const material_rodas = new THREE.MeshPhongMaterial( { color: 0x670 } );
            const roda = new THREE.Mesh(rodas, material_rodas);
            return roda;
        }

    
    this.criaTeto = function(){
        var tetoC = []
        
        tetoC.push(new THREE.Vector3(2.08,0.95,1));
        tetoC.push(new THREE.Vector3(-2.08,0.95,1));
        tetoC.push(new THREE.Vector3(2.08,-0.95,1));
        tetoC.push(new THREE.Vector3(-2.08,-0.95,1));
        tetoC.push(new THREE.Vector3(0.5,0.95,1.5));
        tetoC.push(new THREE.Vector3(0.5,-0.95,1.5));

        return tetoC;

    }

    this.criaParaChoque = function(){
        var paraChoqueF = []

        paraChoqueF.push(new THREE.Vector3(0.8,0,0.8));
        paraChoqueF.push(new THREE.Vector3(1,0.9,0.8));
        paraChoqueF.push(new THREE.Vector3(0.8,0.9,1));
        paraChoqueF.push(new THREE.Vector3(0.8,-0.9,1));
        paraChoqueF.push(new THREE.Vector3(1,0.7,0.2));
        paraChoqueF.push(new THREE.Vector3(1,-0.2,0.2));
        //paraChoqueF.push(new THREE.Vector3(0.8,1,0));
        //paraChoqueF.push(new THREE.Vector3(0.8,-1,0));
        
        return paraChoqueF;
    }

    this.criaVidroFrente = function(){

        var vidro = [];

        vidro.push(new THREE.Vector3(2.08,2,1));
        vidro.push(new THREE.Vector3(-2,2,1));
        vidro.push(new THREE.Vector3(2.08,-1.5,1));
        vidro.push(new THREE.Vector3(-2,-1.5,1));

        return vidro;
    }



        this.updateConvexObject = function(){
            
            let base = this.criaBase();

            carro.carro.add(base);
            
            var tetoPoints = this.criaTeto();

            tetoConvex = new ConvexGeometry(tetoPoints);

            teto = new THREE.Mesh(tetoConvex, estruturaMaterial);
            //teto.translateX(8);
            teto.translateY(-1.60);
            teto.rotateX(THREE.MathUtils.degToRad(-90));
            teto.visible = true;
            teto.castShadow = true;
            teto.receiveShadow = true;
            const scale = 2.9;
            teto.scale.set(scale, scale, scale);
            base.add(teto);


            var paraChoqueFPoints = this.criaParaChoque();

            paraChoquefConvex = new ConvexGeometry(paraChoqueFPoints);

            paraChoquef = new THREE.Mesh(paraChoquefConvex, estruturaMaterial);
            base.add(paraChoquef);
            paraChoquef.translateX(3.7);
            paraChoquef.translateY(-1.3);
            paraChoquef.rotateX(THREE.MathUtils.degToRad(-90));
            paraChoquef.castShadow = true;
            const scale2 = 3;
            paraChoquef.scale.set(scale2, scale2, scale2);


            var vidroFrentePoints = this.criaVidroFrente();

            vidroFrenteConvex = new ConvexGeometry(vidroFrentePoints);

            vidroFrente = new THREE.Mesh(vidroFrenteConvex, vidroMaterial);
            vidroFrente.translateZ(0.87);
            vidroFrente.translateX(1.2);
            vidroFrente.rotateX(THREE.MathUtils.degToRad(0));
            vidroFrente.rotateY(THREE.MathUtils.degToRad(17 ));
            vidroFrente.rotateZ(THREE.MathUtils.degToRad(90))
            const scale3 = 0.4;
            vidroFrente.scale.set(scale3, scale3, scale3);
            vidroFrente.castShadow = false;
            vidroFrente.receiveShadow = false;
            vidroFrente.visible = true;

            teto.add(vidroFrente);

            const eixo_frente = this.criarEixo();
            base.add(eixo_frente);

            const eixo_tras = this.criarEixo();
            base.add(eixo_tras);

            eixo_frente.rotateX(THREE.MathUtils.degToRad(90));
            eixo_frente.translateZ(1);
            eixo_frente.translateX(-4);

            eixo_tras.rotateX(THREE.MathUtils.degToRad(90));
            eixo_tras.translateZ(1);
            eixo_tras.translateX(3);

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

        
        }

        //this.carro.position.set(inicial[0], inicial[1]+0.475, inicial[2]);


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

        /*this.resetPos = () => {
            this.carro.position.set(inicial[0], inicial[1]+0.475, inicial[2]);
            this.carro.rotation.x = 0;
            this.carro.rotation.y = 0;
            this.carro.rotation.z = 0;
        }*/

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

        

  /*      this.keyboardUpdate = () => {

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
          }   */
    }


    

}
let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 10, 10)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
let carro = new Carro(scene, camera);
render();
    function render()
    {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        carro.updateConvexObject();

    }   




