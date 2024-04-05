import styled from 'styled-components';

export const Header_Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;

  height: 65px;
  padding: 0 20px;

  background-color: #ffffff;
  border-bottom: 2px solid #f0f2f5;

  .notification {
    .anticon {
      font-size: 22px;
    }
  }
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 5px;

    cursor: pointer;
  }
  .notify__dropdown {
    cursor: pointer;
  }

  .notify__wrapper {
    .ant-dropdown-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      &::after {
        content: '';
        background: rgb(207, 41, 63);
        border-radius: 50%;
        width: 7px;
        height: 7px;
        opacity: 0;
        visibility: hidden;
      }

      &.show::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;
