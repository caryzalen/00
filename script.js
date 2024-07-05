
const videoElement = document.getElementById('input_video');

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();

const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ringGeometry = new THREE.TorusGeometry(0.05, 0.02, 16, 100);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(ring);

camera3D.position.z = 1;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera3D);
}
animate();

function onResults(results) {
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            const ringPosition = landmarks[9]; // 使用手指的特定點來定位戒指
            ring.position.set(
                (ringPosition.x - 0.5) * 2,
                (ringPosition.y - 0.5) * -2,
                -ringPosition.z
            );
        }
    }
}
