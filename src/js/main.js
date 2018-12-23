import * as THREE from 'three';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0d);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0
camera.position.y = 0;
camera.position.z = 6;
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
let objs = [];
let max = 10;
let min = 0;
let distance = Math.PI * 2 / max

init();

function init() {

	for (let i = min; i < max; i += 1) {

		materials[i] = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

		geometries[i] = new THREE.Geometry();

		for (let v = -8; v < 8; v += 0.1) {
			geometries[i].vertices.push(new THREE.Vector3(0, v, 0))
		}

		objs[i] = new THREE.Line(geometries[i], materials[i]);
		objs[i].position.z = i * 0.25;
		// objs[i].rotation.z = distance * i

		scene.add(objs[i])
	}

	animate();
}


function displaceVertices(obj, dX, dY, dZ, size, magnitude, speed, ts) {

  for (let i = 0; i < obj.geometry.vertices.length; i++) {
    let vertice = obj.geometry.vertices[i]
    let distance = new THREE.Vector3(vertice.x, vertice.y, vertice.z).sub(new THREE.Vector3(dX, dY, dZ))

    vertice.x = Math.sin(distance.length() / size + (ts/speed)) * magnitude
  }

  obj.geometry.verticesNeedUpdate = true

}


function render(ts) {

	analyser.getByteFrequencyData(frequencyData);

	for (let i = min; i < max; i += 1) {

		displaceVertices(
			objs[i],
			2, //dX
		  20, //dY
		  0, //dZ
			frequencyData[i] / 200,  //size
			frequencyData[i] / 150, //magnitude
			frequencyData[i] * 150, //speed
			ts
		)

		objs[i].material.color.setHex((frequencyData[i + 10] / 200) * 0xffffff);
		objs[i].material.opacity = frequencyData[i] * 0.05;
		objs[i].rotation.z += frequencyData[i + 10] * 0.0001
		objs[i].scale.y = frequencyData[i] * 0.001
		objs[i].scale.x = frequencyData[i] * 0.001
	}

}

function animate(ts) {
	requestAnimationFrame(animate);
	render(ts);
	renderer.render(scene, camera);
}
