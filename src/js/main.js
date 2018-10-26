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
let wireframes = []
let lines = [];
let objs = [];
let max = 400

init();

function init() {

	for (let i = 0; i < max; i += 1) {
		geometries[i] = new THREE.CircleBufferGeometry(2, 1);
		wireframes[i] = new THREE.WireframeGeometry(geometries[i]);
		lines[i] = new THREE.LineSegments(wireframes[i]);
		lines[i].material.depthTest = false;
		lines[i].material.opacity = 1;
		lines[i].material.transparent = true;

		// lines[i].position.x = -1.25 + (Math.PI / max) * i
		// lines[i].position.y = -1.25 + (Math.PI / max) * i

		scene.add(lines[i]);
	}

	animate();
	// window.addEventListener('click', () => audio.play())
}

function render() {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = 0; i < max; i += 1) {
		lines[i].rotation.z += frequencyData[i] * 0.00001
		lines[i].scale.set(0.1 + frequencyData[i] / 250, 0.1 + frequencyData[i] / 250, 0.1 + frequencyData[i] / 250)
		lines[i].material.color.setRGB(frequencyData[i] / 400, frequencyData[i] / 450, frequencyData[i] / 400);
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
	renderer.render(scene, camera);
}
