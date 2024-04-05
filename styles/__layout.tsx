import styled from 'styled-components';

export const LayoutHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
`;
export const LayoutSidebar = styled.div`
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

export const LayoutContent = styled.div<{ isOpen: boolean }>`
  min-height: calc(100vh - 50px);
  margin-left: ${(props) => (props.isOpen ? 249 : 48)}px;
  padding-bottom: 0.5px;

  background-color: #f0f2f5;
  transition: all 0.3s;
`;
