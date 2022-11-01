import React, { useEffect, useRef, useState } from 'react'
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import {  HAND_CONNECTIONS } from "@mediapipe/hands";

const createWorker = createWorkerFactory(() => import('./worker.js'));

const Container = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  let stream = null;
  
  const webWorker = useWorker(createWorker);
  const [requestId, setRequestId] = useState(null);

  const onClick = async () => {
   const result = await webWorker.hello("silqwer");
   console.log(result);

    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 480);
    
    const imageData = canvasRef.current.getContext("2d").getImageData(0, 0, 640, 480);
    
    const result2 = await webWorker.handsSend(imageData);
    console.log(result2)
  }

  const canvasRender = async() => {
    canvasRef.current.getContext("2d").save();
    canvasRef.current.getContext("2d").clearRect(0, 0, 640, 480);
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 480);

    const imageData = canvasRef.current.getContext("2d").getImageData(0, 0, 640, 480);
    const results = await webWorker.handsSend(imageData);
 

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasRef.current.getContext("2d"), landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasRef.current.getContext("2d"), landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
    }

    const id = requestAnimationFrame(canvasRender);
    setRequestId(id);
  }

  const onClickStop = () => {
    const id = cancelAnimationFrame(requestId);
    setRequestId(id);
  }

  const onClickPlay = async () => {
    canvasRender();
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
      <button type='button' onClick={onClickPlay}>재생</button>
      <button type='button' onClick={onClickStop}>정지</button>
    </>

  )
}

export default Container