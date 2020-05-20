import * as THREE from '../build/three.module.js';
import {OBJLoader2} from './js/OBJLoader2.js';
import {OrbitControls} from './js/OrbitControls.js';
import {MTLLoader} from './js/MTLLoader.js';
import {VRButton} from './js/VRButton.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000);

var renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color(0x5a5a5a);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

camera.position.z += 5;
// let camGroup = new THREE.Group();

// camGroup.position.set(0,1.6,5);
// scene.add(camGroup);
// camGroup.add(camera);

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

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

let mtlLoader = new MTLLoader();
mtlLoader.load('./models/cube1.mtl', function(materials){
  
  materials.preload();

  let objLoader = new OBJLoader2();
  //objLoader.set(materials);
  objLoader.load('./models/cube1.obj', function(object){
  //object.position.set(0,1.6,0);
  scene.add(object);
  });
});



var animate = function(){
  requestAnimationFrame( animate );

  controls.update();

  renderer.render( scene, camera );
};

animate();