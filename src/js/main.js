import * as THREE from 'three';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0d);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 12
camera.position.y = 0;
camera.position.z = 5;
// camera.lookAt(0, 0, 0)
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
let planes = [];
let objs = [];
let max = 40

init();

function init() {

	for (let i = -max; i < max; i += 1) {

		materials[i] = new THREE.MeshBasicMaterial({
			color: 0xb4b4b6
		})

		geometries[i] = new THREE.PlaneGeometry(0.25, 15, 40, 40);
		planes[i] = new THREE.Mesh(geometries[i], materials[i]);

		planes[i].rotation.z = -Math.PI / 4
		planes[i].position.x = i * 0.75

		scene.add(planes[i])
	}

	animate();
}


function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

    vertice.z = Math.sin(distance.length() / size + (ts/speed)) * magnitude
  }

  obj.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = -max; i < max; i += 1) {

		displaceVertices(
			planes[i],
			0, //dX
		  0, //dY
		  1, //dZ
			2,  //size
			frequencyData[i] / 300, //magnitude
			400, //speed
			ts
		)

		// planes[i].rotation.z += frequencyData[i] * 0.00001
	}

}

function animate(ts) {
	requestAnimationFrame(animate);
	render(ts);
	renderer.render(scene, camera);
}
