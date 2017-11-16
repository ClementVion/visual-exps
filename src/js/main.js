import * as THREE from 'three';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer, sphereOne, sphereTwo;

let ctx = new AudioContext();
let audio = document.getElementById('audio');
let audioSrc = ctx.createMediaElementSource(audio);
let analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

init();

function init() {
	// First sphere
	let geometrySphereOne = new THREE.SphereGeometry( 1.5, 20, 20 );
	let materialSphereOne = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.3, transparent: true } );
	sphereOne = new THREE.Mesh( geometrySphereOne, materialSphereOne );

	// Second sphere
	let geometrySphereTwo = new THREE.SphereGeometry( 1.501, 25, 25);
	let materialSphereTwo = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 1, transparent: true } );
	sphereTwo = new THREE.Mesh( geometrySphereTwo, materialSphereTwo );

	scene.add(sphereOne);
	scene.add(sphereTwo);

	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	animate();
	audio.play();
}

function render() {
	sphereTwo.rotation.x += 0.001;
	analyser.getByteFrequencyData(frequencyData);
	let color = new THREE.Color(1, 0, 0);
	sphereOne.material.color.setRGB(0,(frequencyData[4]/255),(frequencyData[4]/255));
	sphereTwo.material.color.setRGB(0,(frequencyData[50]/255),(frequencyData[50]/255));
}

function animate() {
	sphereOne.rotation.x += 0.01;
	requestAnimationFrame( animate );
	render();
	renderer.render( scene, camera );
}
