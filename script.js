import * as THREE from '../build/three.module.js';
import {OBJLoader2} from './js/OBJLoader2.js';
import {OrbitControls} from './js/OrbitControls.js';
import {MTLLoader} from './js/MTLLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 1;

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.campingFactor = 0.25;
controls.enableZoom = true;

// var keyLight = new THREE.DirectionalLight(new THREE.Color('rgb(30, 100%, 75%)'));
// keyLight.position.set(-100, 0, 100);

var keyLight = new THREE.AmbientLight(new THREE.Color('rgb(255, 100%, 75%)'));
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('rgb(240, 100%, 75%)'));
fillLight.position.set(100, 0, 100);

// var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
// backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
// scene.add(backLight);

let mtlLoader = new MTLLoader();
mtlLoader.load('./models/3dobject.mtl', function(materials){
  
  materials.preload();

  let objLoader = new OBJLoader2();
  // objLoader.setMaterials(materials);
  objLoader.load('./models/3dobject.obj', function(object){
  
  scene.add(object);
  });
});


var animate = function(){
  requestAnimationFrame( animate );

  controls.update();

  renderer.render( scene, camera );
};

animate();