/* eslint-disable no-undef */

let time = new Date().getTime();
importScripts("/worker/hands.js?time="+time);


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

initHands();

onmessage = async (e) => {
  console.log(e.data);
  const [eventName, data] = e.data;
  if(eventName === "hello"){
    
    console.log("imageData:", imageData)
    postMessage("How are you? :D");
    return 
  } 

  if(eventName === "hands"){
    const imageData = new ImageData(data, 640, 480);
    console.log("imageData:", imageData);


    await hands.send({image: imageData});
  }
}