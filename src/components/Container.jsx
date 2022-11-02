import React, { useEffect, useRef } from 'react'
import Worker from 'web-worker';

const Container = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  let stream = null;
  
  const webWorker = new Worker(
    new URL('./worker.mjs', import.meta.url),
    { type: 'module' }
  );


  webWorker.addEventListener('message', e => {
    console.log(e.data) 
  });


  const onClick = () => {
  
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 480);  
    const imageData = canvasRef.current.getContext("2d").getImageData(0, 0, 640, 480).data;
    webWorker.postMessage(imageData);
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