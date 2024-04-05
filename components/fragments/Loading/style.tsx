import styled from 'styled-components';

export const customLoading = styled.div<{ fullPage?: boolean; isOpacity?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: ${(props) => (props.fullPage ? 'fixed' : 'absolute')};
  top: 0;
  left: 0;
  z-index: 1000;

  &::after {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9998;
    background: #fff;
    opacity: ${(props) => (props.isOpacity ? '0.5' : '')};
  }

  .ant-space {
    position: relative;
    z-index: 1000;
  }
`;
