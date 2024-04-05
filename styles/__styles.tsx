import styled from 'styled-components';

export const Container = styled.div``;
export const PageContent = styled.div<{ noCustom?: boolean }>`
  margin: 20px auto;
  padding: ${(props) => (!props.noCustom ? '15px 20px' : '')};
  width: calc(100% - 40px);
  position: relative;

  border-radius: 4px;

  background-color: ${(props) => (!props.noCustom ? '#ffffff' : '')};
`;
export const PageContent_Title = styled.h2`
  margin-bottom: 10px;
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #ececec;
`;

export const Text_Truncate = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
`;
