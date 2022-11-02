import React, { useEffect, useRef } from 'react'
import { Holistic } from "@mediapipe/holistic";


const Container = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  let stream = null;

  const holistic = new Holistic({
    // wasm, data 등의 파일들을 fetch해온다
    // @TODO node_modules에도 파일이 있으나 경로를 맞춰주는 작업이 필요함
    locateFile: file => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    },
  });

  holistic.setOptions({
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: 'background',
  })

  holistic.onResults((result)=>{
    console.log("[holistic: ]:", result);
  });
  
  const webWorker = new Worker("/worker.js");
  webWorker.onmessage = (e) => {
    console.log(e.data);
  } 

  const onClick = async () => {
    //webWorker.postMessage(['hello', "Hi :)"]);

    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 480);
    
    const imageData = canvasRef.current.getContext("2d").getImageData(0, 0, 640, 480).data;
    console.log("imageData:", imageData)

    const data = new ImageData(imageData, 640, 480);
    console.log("data:", data);
    
    //await holistic.send({image: data});
    
    webWorker.postMessage(['hands', imageData]);
  }

  const getMedia = async (option) => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({video: true});
      /* 스트림 사용 */
      console.log(stream)
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      }

    } catch(err) {
      /* 오류 처리 */
    }
  } 

  useEffect(()=> {
    getMedia();
  }, []);


  return (
    <>
      <div>Container</div>
      <video ref={videoRef} />
      <canvas ref={canvasRef} width={640} height={480} />
      <button type='button' onClick={onClick}>전송</button>
    </>

  )
}

export default Container