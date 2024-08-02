import { useEffect, useRef, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import { useCalendar } from '../../store/calendar';

const EditDetailPhoto = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { setPhoto, setCalImg, calendarData, calImg } = useCalendar();

  const [isDeniedCameraPermission, setIsDeniedCameraPermission] =
    useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsDeniedCameraPermission(false);
        }
      } catch (error) {
        console.error('Error accessing camera: ', error);
        setIsDeniedCameraPermission(true);
        setIsCameraOn(false);
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isCameraOn]);

  const toggleCamera = () => setIsCameraOn((prevState) => !prevState);

  const photoInput = useRef<HTMLInputElement | null>(null);
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const imageUrl = URL.createObjectURL(file);

      setPhoto(imageUrl);
      setCalImg(formData);
    }
  };

  const handleClick = () => photoInput.current?.click();
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
      <button onClick={handleClick}>
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
            style={{ color: '#777777', margin: '5px 5px', cursor: 'pointer' }}
            onClick={deletePhoto}
          />
        </div>
      )}
    </div>
  );
};

export default EditDetailPhoto;
