import * as THREE from 'three';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe1e0);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let ctx = new AudioContext();
let audio = document.getElementById('audio');
let audioSrc = ctx.createMediaElementSource(audio);
let analyser = ctx.createAnalyser();
audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
let frequencyData = new Uint8Array(analyser.frequencyBinCount);


let geometries = [];
let materials = [];
let planes = [];
let max = 50

init();

function init() {

	for (let i = 0; i < max; i += 1) {
		geometries[i] = new THREE.PlaneGeometry(0.025, 2, 10, 10);
		materials[i] = new THREE.MeshBasicMaterial({color: 0x4e4e4e, side: THREE.DoubleSide});
		planes[i] = new THREE.Mesh(geometries[i], materials[i]);
		planes[i].position.x = -1.25 + (Math.PI / max) * i
		planes[i].position.y = (Math.PI / max)
		planes[i].rotation.z = (max + 360) * i
		scene.add(planes[i]);
	}

	animate();
	// window.addEventListener('click', () => audio.play())
}

function render() {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = 0; i < max; i += 1) {
		// planes[i].rotation.z += frequencyData[4] * 0.00001
		planes[i].scale.set(0.25 + frequencyData[i] / 1000, 1 + frequencyData[i] / 200, 1)
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
	renderer.render(scene, camera);
}
