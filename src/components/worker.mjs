/* eslint-disable no-restricted-globals */
import { Hands } from "@mediapipe/hands";

let hands = null;
let result = null;

const initHands = () => {
  hands = new Hands({
    locateFile: (file) => {
      console.log("FILE:",file);
      // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      return `/worker/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  
  hands.onResults((onResults)=>{
    console.log("onResults:", onResults);
    result = onResults
  });

  console.log("holistic worker initialization!");
}

initHands();

addEventListener('message', async e => {
  const imageData = new ImageData(e.data, 640, 480);
  await hands.send({ image: imageData });
  postMessage(result);
});