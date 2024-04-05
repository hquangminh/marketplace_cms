import styled from 'styled-components';

export const Product_wrapper = styled.div`
  margin-top: 20px;
  position: relative;

  .ant-form-item {
    margin-bottom: 12px;
  }

  .file__details--item {
    display: flex;
    gap: 20px;

    .ant-form-item {
      margin-bottom: 0;
    }
  }

  .custom__err {
    font-size: 80%;
    color: #ff4d4f;
  }

  .content {
    margin: 0 auto;
    padding: 15px 20px;
    width: calc(100% - 40px);
    position: relative;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .group-btn-action-form {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
`;
