import * as THREE from 'three';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
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
let materials = []
let circles = [];
let objs = [];
let max = 100
let i = 0 // current index
let r = 0.5

init();

function init() {

	for (let i = 0; i < max; i += 1) {
		const r = Math.random() * 2
		geometries[i] = new THREE.RingGeometry(r, r + 0.01, 64);
		materials[i] = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
		circles[i] = new THREE.Mesh(geometries[i], materials[i])

		scene.add(circles[i]);
	}

	// createCircles()

	animate();
}

function createCircles () {

	setInterval(() => {

		if (circles[i]) {
			scene.remove(circles[i])
		}

		const r = Math.random() * 2
		geometries[i] = new THREE.RingGeometry(r, r + 0.01, 64);
		materials[i] = new THREE.MeshBasicMaterial();
		circles[i] = new THREE.Mesh(geometries[i], materials[i])
		scene.add(circles[i]);

		i = i + 1
		if (i === max) i = 0

	}, 1000)

}


function render() {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = 0; i < max; i += 1) {
		if (!circles[i]) return;

		// circles[i].position.set(frequencyData[i] / 250, frequencyData[i] / 250, frequencyData[i] / 250)
		circles[i].rotation.y += frequencyData[i] * 0.0001
		circles[i].rotation.x += frequencyData[i] * 0.0001
		circles[i].scale.set(frequencyData[i] / 150, frequencyData[i] / 250, frequencyData[i] / 150)
		circles[i].material.color.setHex((frequencyData[i] / 100) * 0xffffff);
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
	renderer.render(scene, camera);
}
