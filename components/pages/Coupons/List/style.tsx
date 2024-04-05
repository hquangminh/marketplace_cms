import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 20px 15px 20px;

  position: relative;

  .btn-add {
    position: absolute;
    right: 20px;
    top: 7px;
  }
  .ant-tabs-nav {
    &:before {
      border-color: #ddd;
    }
  }
`;
export const SearchBox = styled.div`
  padding: 10px 0;

  background-color: #fff;

  .btn-search {
    display: flex;

    font-size: 18px;
    color: #555;
    cursor: pointer;
  }
`;

export const CouponList = styled.div`
  margin-top: 20px;
`;
