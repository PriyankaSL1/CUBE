import * as THREE from '../build/three.module.js';
//import {OBJLoader2} from './js/OBJLoader2.js';
import {OrbitControls} from './js/OrbitControls.js';
//import {MTLLoader} from './js/MTLLoader.js';
//import {VRButton} from './js/VRButton.js';
import {GLTFLoader} from './js/GLTFLoader.js';
import {PointerLockControls} from './js/PointerLockControls.js';

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = true;

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a5a5a);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// renderer.xr.enabled = true;
// document.body.appendChild(VRButton.createButton(renderer));

//camera.position.x += 5;
// let camGroup = new THREE.Group();

// camGroup.position.set(0.31, 1.16, 0.51);
// scene.add(camGroup);
// camGroup.add(camera);

// var controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.campingFactor = 0.25;
// controls.enableZoom = true;

// var keyLight = new THREE.DirectionalLight(new THREE.Color('rgb(30, 100%, 75%)'));
// keyLight.position.set(-100, 0, 100);

var keyLight = new THREE.AmbientLight(new THREE.Color('rgb(1, 1, 1)'));
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('rgb(1, 1, 1)'));
fillLight.position.set(100, 0, 100);

// var backLight = new THREE.DirectionalLight(1, 1);
// backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
// scene.add(backLight);

var light = new THREE.HemisphereLight( 0.72, 0.75, 0.75 );
light.position.set(0,0,0 );
scene.add( light );

// let mtlLoader = new MTLLoader();
// mtlLoader.load('./models/80000faces.mtl', function(materials){
  
//   materials.preload();

//   let objLoader = new OBJLoader2();
//   //objLoader.setMaterials(materials);
//   objLoader.load('./models/80000faces.obj', function(object){
//   //object.position.set(0,1.6,0);
//   scene.add(object);
//   });
// });

var controls = new PointerLockControls( camera, document.body );

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

instructions.addEventListener( 'click', function () {

	controls.lock();

  }, false );
  
controls.addEventListener( 'lock', function () {

	instructions.style.display = 'none';
	blocker.style.display = 'none';
} );

controls.addEventListener( 'unlock', function () {

	blocker.style.display = 'block';
	instructions.style.display = '';
} );

scene.add( controls.getObject() );

var meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(10,10, 10,10),
	new THREE.MeshBasicMaterial({color:0x5a5a5a, wireframe:USE_WIREFRAME})
);
meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
scene.add(meshFloor);

//camera.position.set(0.31, 1.16, 0.51);
camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0,player.height,0));

var model;
var loader = new GLTFLoader();
loader.load('./models/80000textured.glb', function (gltf) {
	
	model = gltf.scene;
	model.rotation.z += 3;
	model.rotation.y +=0.19;
	model.rotation.x += 8;
	model.position.y += player.height;
	model.position.x += 0;
	model.position.z -= 3;
  scene.add( model );
	
	gltf.animations; // Array<THREE.AnimationClip>
	gltf.scene; // THREE.Group
	gltf.scenes; // Array<THREE.Group>
	gltf.camera; // Array<THREE.Camera>
	gltf.asset; // Object

}
);

function animate(){
	requestAnimationFrame( animate);
	
	// Keyboard movement inputs
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed/6;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed/6;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed/6;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed/6;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed/6;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed/6;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed/6;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed/6;
	}
	
	// Keyboard turn inputs
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed/2;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed/2;
	}
	
	renderer.render(scene, camera);
	
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
// use this if you are wanting to use three js and webXr.
// renderer.setAnimationLoop(() => {

//   //controls.update();
//   pointer.update();
//   renderer.render(scene, camera);
// });

animate();