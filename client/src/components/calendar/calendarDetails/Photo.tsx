import { useEffect } from 'react';
import styled from 'styled-components';
import { useCalendar } from '../../../store/store';

interface photoSrc {
  photo?: string;
}

const Photo = ({ photo }: photoSrc) => {
  const { setPhoto } = useCalendar();

  useEffect(() => {
    if (photo !== undefined) {
      setPhoto(photo);
    }
  }, [photo, setPhoto]);

  if (photo !== null) {
    return (
      <PhotoContainer>
        <StyledImage src={photo} alt='기록 사진' />
      </PhotoContainer>
    );
  }
  return null;
};

export default Photo;

const PhotoContainer = styled.div``;

const StyledImage = styled.img`
  width: 200px;
`;
