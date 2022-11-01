/* eslint-disable no-undef */

//importScripts("/worker/hands.js?time="+time);
//import { Hands } from '/worker/hands.js';
let time = new Date().getTime();


let hands = null;
let handsModelInit = false;

const initHands = () => {
  hands = new Hands({
    locateFile: (file) => {
      console.log("FILE:",file);
      return `/worker/${file}`
    },
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  
  hands.onResults((result)=>{
    postMessage(result);
  });

  console.log("holistic worker initialization!");
  handsModelInit = true
}

//initHands();

// onmessage = async (e) => {
//   console.log(e.data);
//   const [eventName, data] = e.data;
//   if(eventName === "hello"){
//     postMessage("How are you? :D");
//     return 
//   } 

//   if(eventName === "hands"){
//     console.log(data);
//     await hands.send({image: data});
//   }
// }

export const hello = (name) => {
  return `How are you? ${name} :D`;
}

export const handsSend = (imageData) => {
  console.log(imageData)
  return `imageData :D`;
}

