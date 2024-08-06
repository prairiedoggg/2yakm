import styled from 'styled-components';

const ValidationError = ({
  condition,
  children
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Container style={{ display: condition ? 'initial' : 'none' }}>
      <b>!</b> {children}
    </Container>
  );
};

const Container = styled.div`
  color: red;
  font-size: 0.9rem;
`;

export default ValidationError;
