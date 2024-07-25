import React, { useEffect, useState, useRef } from 'react';

const EditDetailPhoto: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (isCameraOn) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } else {
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (
              videoRef.current.srcObject as MediaStream
            ).getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <video
        ref={videoRef}
        style={{
          display: isCameraOn ? 'block' : 'none',
          width: '100%',
          height: 'auto'
        }}
        autoPlay
        playsInline
      />
      <input type='file' accept='image/*' capture='camera' />
    </div>
  );
};

export default EditDetailPhoto;