import * as THREE from 'three';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
camera.lookAt(0, 0, 0)
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
let lines = [];
let objs = [];
let max = 200

init();

function init() {

	for (let i = 0; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial({color: 0xffffff})

		geometries[i] = new THREE.Geometry();
		for (let v = -2; v < 2; v += 0.1) {
			geometries[i].vertices.push(new THREE.Vector3(v, 0, 0));
			// geometries[i].vertices.push(new THREE.Vector3(0, v + i, 0));
		}

		lines[i] = new THREE.Line(geometries[i], materials[i]);

		lines[i].rotation.z = i

		scene.add(lines[i])
	}

	animate();
}


function displaceVertices(line, dX, dY, size, magnitude, speed, ts) {

  for (let i = 0; i < line.geometry.vertices.length; i++) {
    let vertice = line.geometry.vertices[i]
    let distance = new THREE.Vector2(vertice.x, vertice.y).sub(new THREE.Vector2(dX, dY))

    vertice.y = Math.sin(distance.length() / size + (ts/speed)) * magnitude
  }

  line.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = 0; i < max; i += 1) {

		for (let v = 0; v < lines[i].geometry.vertices.length; v += 1) {

			displaceVertices(
				lines[i],
				-10, //dX
			  5, //dY
				frequencyData[i + v] / 20,  //size
				frequencyData[i + v] / 75, //magnitude
				frequencyData[i + v] * 150, //speed
				ts
			)

		}
		lines[i].geometry.verticesNeedUpdate = true

		// lines[i].rotation.z += frequencyData[i] * 0.00001

	}

}

function animate(ts) {
	requestAnimationFrame(animate);
	render(ts);
	renderer.render(scene, camera);
}
