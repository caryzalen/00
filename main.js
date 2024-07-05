import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load ring model
const loader = new GLTFLoader();
let ring;
loader.load('path/to/your/ring_model.glb', function (gltf) {
    ring = gltf.scene;
    scene.add(ring);
});

// Initialize MediaPipe Hands
const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({maxNumHands: 1, modelComplexity: 1});
hands.onResults(onResults);

// Get video stream
const video = document.getElementById('input_video');
navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
    video.srcObject = stream;
    video.play();
    hands.send({image: video});
});

// Handle results from hand tracking
function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        // Assume landmarks[9] is the finger position
        const fingerTip = landmarks[9];
        if (ring) {
            ring.position.set(fingerTip.x, fingerTip.y, fingerTip.z);
        }
    }
    renderer.render(scene, camera);
}
