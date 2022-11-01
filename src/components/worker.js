
import {  Hands } from "@mediapipe/hands";

let hands = null;
let handsModelInit = false;
let result = null;
const initHands = () => {
  hands = new Hands({
    locateFile: (file) => {
      console.log("FILE:",file);
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results)=>{
    console.log(results);
    result = results
  });
  

  console.log("holistic worker initialization!");
  handsModelInit = true
}

initHands();

export const hello = (name) => {
  return `How are you? ${name} :D`;
}

export const handsSend = async (imageData) => {
  await hands.send({ image: imageData });
  return result;
}

