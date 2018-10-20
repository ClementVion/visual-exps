import * as THREE from 'three';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer, sphereOne, sphereTwo, sphereThree, sphereFour, sphereFive, sphereSix;

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
	let geometrySphereOne = new THREE.SphereGeometry( 1, 20, 20 );
	let materialSphereOne = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.15, transparent: true } );
	sphereOne = new THREE.Mesh( geometrySphereOne, materialSphereOne );

	// Second sphere
	let geometrySphereTwo = new THREE.SphereGeometry( 1.001, 25, 25);
	let materialSphereTwo = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.3, transparent: true } );
	sphereTwo = new THREE.Mesh( geometrySphereTwo, materialSphereTwo );


	// Third sphere
	let geometrySphereThree = new THREE.SphereGeometry( 1.5, 20, 20);
	let materialSphereThree = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.1, transparent: true } );
	sphereThree = new THREE.Mesh( geometrySphereThree, materialSphereThree );

	// Fourth sphere
	let geometrySphereFour = new THREE.SphereGeometry( 1.501, 25, 25);
	let materialSphereFour = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.2, transparent: true } );
	sphereFour = new THREE.Mesh( geometrySphereFour, materialSphereFour );


	// Fifth sphere
	let geometrySphereFive = new THREE.SphereGeometry( 2, 20, 20);
	let materialSphereFive = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.05, transparent: true } );
	sphereFive = new THREE.Mesh( geometrySphereFive, materialSphereFive );

	// Sixth sphere
	let geometrySphereSix = new THREE.SphereGeometry( 2.001, 25, 25);
	let materialSphereSix = new THREE.MeshBasicMaterial( { color: 0xff3399, opacity: 0.3, transparent: true } );
	sphereSix = new THREE.Mesh( geometrySphereSix, materialSphereSix );


	scene.add(sphereOne);
	scene.add(sphereTwo);
	scene.add(sphereThree);
	scene.add(sphereFour);
	scene.add(sphereFive);
	scene.add(sphereSix);

	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	animate();
	audio.play();
}

function render() {
	sphereTwo.rotation.x += 0.001;
	sphereTwo.rotation.y += 0.001;
	sphereFour.rotation.x += 0.01;
	sphereFour.rotation.y += 0.01;
	sphereSix.rotation.x += 0.01;
	sphereSix.rotation.y += 0.01;
	analyser.getByteFrequencyData(frequencyData);
	let color = new THREE.Color(1, 0, 0);

	sphereOne.material.color.setRGB((frequencyData[4]/255), (frequencyData[4]/255), 255);
	sphereTwo.material.color.setRGB((frequencyData[10]/255), (frequencyData[10]/255), 255);

	sphereThree.material.color.setRGB((frequencyData[4]/255),(frequencyData[4]/255), 255);
	sphereFour.material.color.setRGB((frequencyData[10]/255), (frequencyData[10]/255), 255);

	sphereFive.material.color.setRGB((frequencyData[4]/255), (frequencyData[4]/255), 255);
	sphereSix.material.color.setRGB((frequencyData[10]/255), (frequencyData[10]/255), 255);
}

function animate() {
	sphereOne.rotation.x += 0.01;
	requestAnimationFrame( animate );
	render();
	renderer.render( scene, camera );
}
