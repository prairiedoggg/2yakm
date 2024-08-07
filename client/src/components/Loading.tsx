import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';

const Loading = ({}: {}) => {
  return (
    <Overlay>
      <Icon
        icon='eos-icons:bubble-loading'
        width='4rem'
        height='4rem'
        style={{ color: 'white' }}
      />
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  animation: fadeIn 0.3s ease-in forwards;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default Loading;
