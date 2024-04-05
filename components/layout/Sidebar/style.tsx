import styled from 'styled-components';

export const activeSideBar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;

  .ant-menu.ant-menu-root {
    flex: 1 1 0%;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #001529;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
    &:hover::-webkit-scrollbar-thumb {
      background: #ffffff52;
    }

    .ant-menu-item:first-child {
      margin-top: 0;
    }
  }

  .ant-pro-sider-logo {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;
    padding: 10px;

    background-color: #001529;

    a {
      width: 100%;
      height: 100%;
    }
  }

  .parent__menu {
    flex: 1 1 0%;
    width: 208px;
  }

  .ant-menu-inline-collapsed {
    width: 48px;
  }

  .nav__btn {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;
    padding: 0 10px;

    background-color: #001529;
    color: #fff;

    cursor: pointer;
    text-align: left;
  }
`;
