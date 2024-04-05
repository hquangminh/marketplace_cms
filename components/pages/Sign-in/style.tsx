import styled from 'styled-components';

export const wrapperSignIn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: 20px;
  background-image: url('https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/seesoop/v2/images/1645411420_400842_ff85c4cb-b24d-4920-8602-56cac474311b.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  .wrapper {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    border: 1px solid rgb(239, 239, 239);
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 4px;
    color: rgb(73, 159, 181);
    background: white;
    border-radius: 10px;

    .ant-form-item-required::before {
      display: none !important;
    }

    .title {
      padding-bottom: 2rem;
      color: rgb(73, 159, 181);
    }

    label {
      color: rgb(139, 139, 139);
    }

    input {
      padding: 0.7rem 1rem;
      background-color: rgb(245, 248, 250);
      border: 1px solid rgb(233, 236, 239);
    }

    .login-form-button {
      height: 40px;
      border-radius: 4px;
      font-size: 16px;
    }
  }
`;
