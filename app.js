let video;
let model;
let scene, camera, renderer, ring;

async function init() {
    video = document.getElementById('video');
    await setupCamera();
    video.play();

    model = await handpose.load();
    startDetection();

    initThreeJS();
    animate();
}

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => { resolve(video); };
    });
}

async function startDetection() {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
        const hand = predictions[0];
        const indexFingerTip = hand.annotations.indexFinger[3];
        updateRingPosition(indexFingerTip);
    }
    requestAnimationFrame(startDetection);
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();
    loader.load('path/to/your/ring_model.glb', (gltf) => {
        ring = gltf.scene;
        scene.add(ring);
        ring.scale.set(0.01, 0.01, 0.01); // Adjust scale as necessary
    });

    camera.position.z = 5;
}

function updateRingPosition(position) {
    if (ring) {
        ring.position.set(position[0] / 100, -position[1] / 100, -position[2] / 100);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();