
const videoElement = document.getElementById('video');
const ringEntity = document.getElementById('ring');

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
  }
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
  width: 640,
  height: 480
});
camera.start();

function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const ringPosition = landmarks[8]; // 手指食指指尖位置

    // 將戒指綁定到手指食指指尖位置
    ringEntity.setAttribute('position', {
      x: (ringPosition.x - 0.5) * 2,
      y: -(ringPosition.y - 0.5) * 2,
      z: -ringPosition.z * 2
    });
  }
}
