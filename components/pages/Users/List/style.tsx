import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 20px 15px 20px;

  .ant-tabs-nav {
    margin-bottom: 20px;
    &:before {
      border-color: #ddd;
    }
  }
  .showroom_logo {
    width: 30px;
    height: 30px;
  }
  .btn-add {
    position: absolute;
    top: 79px;
    z-index: 1;
    right: 20px;
  }
`;
