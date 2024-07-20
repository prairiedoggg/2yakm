/**
File Name : NewsDescription
Description : 뉴스 하단 설명
Author : 임지영

History
Date        Author   Status    Description
2024.07.16  임지영   Created
2024.07.18  임지영   Modified    margin값 변경
2024.07.21  임지영   Modified    코치님 코드 리뷰 수정
*/

import styled from 'styled-components';
import DOMPurify from 'dompurify';

const DescriptionContainer = styled.div`
  margin: 5vh 7vw;
`;

const ChickenPharm = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-top: 1.5vh;
`;

interface NewsDescriptionProps {
  description: string;
}

const NewsDescription = ({ description }: NewsDescriptionProps) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <DescriptionContainer>
      <ChickenPharm>@chickenPharm</ChickenPharm>
      <Description dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
    </DescriptionContainer>
  );
};

export default NewsDescription;
