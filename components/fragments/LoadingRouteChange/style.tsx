import styled from 'styled-components';

export const LoadingChange = styled.div`
  .lds-facebook {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    div {
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      background: #001529;
      animation: lds-facebook 0.5s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }

    @keyframes lds-facebook {
      0% {
        top: 8px;
        height: 64px;
      }
      50%,
      100% {
        top: 24px;
        height: 32px;
      }
    }

    div:nth-child(1) {
      left: 8px;
      animation-delay: -0.24s;
    }
    div:nth-child(2) {
      left: 32px;
      animation-delay: -0.12s;
    }
    div:nth-child(3) {
      left: 56px;
      animation-delay: 0;
    }
  }

  .overlay__wrapper,
  .loading__wrapper {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
  }

  .loading__wrapper {
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlay__wrapper {
    z-index: 1000;
    backdrop-filter: blur(5px);
  }
`;
