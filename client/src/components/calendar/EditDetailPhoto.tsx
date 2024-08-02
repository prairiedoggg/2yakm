import { useEffect, useRef, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import { useCalendar } from '../../store/store';

const EditDetailPhoto = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { setPhoto, setCalImg, calendarData, calImg } = useCalendar();

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

  const photoInput = useRef<HTMLInputElement | null>(null);
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const imageUrl = URL.createObjectURL(file);

      setPhoto(imageUrl);
      setCalImg(formData);

      console.log(imageUrl);
      console.log(formData.get('file'));
    }
  };

  const handleClick = () => {
    if (photoInput.current) {
      photoInput.current.click();
    }
  };

  const deletePhoto = () => {
    setCalImg(null);
    setPhoto(null);
  };

  return (
    <div style={{ width: '150px' }}>
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
      <button onClick={() => handleClick()}>
        사진 업로드
        <input
          type='file'
          accept='image/jpg, image/jpeg, image/png'
          multiple
          ref={photoInput}
          onChange={onChangeImage}
          style={{ display: 'none' }}
        />
      </button>
      {calendarData?.photo && (
        <div>
          <img
            src={calendarData?.photo}
            alt='기록 이미지'
            style={{ width: '100%', height: 'auto' }}
          />
          <FiXCircle
            style={{ color: '#777777', margin: '5px 5px' }}
            onClick={() => deletePhoto()}
          />
        </div>
      )}
    </div>
  );
};

export default EditDetailPhoto;
