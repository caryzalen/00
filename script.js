const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const videoElement = document.createElement('video');
const canvasElement = document.createElement('canvas');
document.body.appendChild(canvasElement);
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    if (results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        // 使用landmarks數據來定位戒指
        const ring = document.getElementById('ring');
        ring.object3D.position.set(landmarks[9].x, landmarks[9].y, landmarks[9].z);
    }
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();
