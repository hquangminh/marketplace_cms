import styled from 'styled-components';

export const BannerCreateComponent_wrapper = styled.div`
  position: relative;
  .content {
    margin: 20px auto;
    padding: 15px 20px;
    width: calc(100% - 40px);
    position: relative;
    border-radius: 4px;
    background-color: #ffffff;

    &__submit {
      position: sticky;
      top: 0;
    }
  }

  .group-btn-action-form {
    margin-top: 0;
  }
  .file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Gallery_wrapper = styled.div`
  margin-top: 15px;

  .ant-upload-list-item-name {
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 50px;
    color: initial;
  }

  .ant-upload-list-item-thumbnail,
  .ant-upload-list-item-name {
    pointer-events: none;
  }

  .form-item-only-label {
    margin-bottom: 0;
    .ant-form-item-control-input {
      display: none;
    }
  }

  .ant-upload-text::after {
    display: inline-block;
    margin-left: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`;
