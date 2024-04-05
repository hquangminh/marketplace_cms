import styled from 'styled-components';

export const FeedbackComponent_wrapper = styled.div`
  word-break: break-all;
  .feedback__header {
    display: flex;
    justify-content: space-between;
    .ant-comment-inner {
      padding: 10px 0;
    }
  }
  .order-modeling-feedback-total {
    font-size: 24px;
    color: #1f1f1f;
  }
  .ant-comment-nested {
    margin-left: 35px;
    .image_feedback {
      padding: 0 10px;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
  .input__text {
    display: flex;
    margin-top: 50px;
    .ant-input {
      margin-right: 10px;
      border: 1px solid #f0f0f0;
      width: 45%;
      height: 49px;
      border-radius: 8px;
    }
  }
  .ant-btn {
    padding: 5px 10px;
    display: flex;
    align-items: center;
  }
  .status__feedback {
    display: flex;
    justify-content: space-between;
    .title__feedback {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .title {
        margin-right: 10px;
        color: rgba(0, 0, 0, 0.85);
        padding-bottom: 2px;
        font-size: 18px;
      }
      .content {
        padding-bottom: 8px;
      }
    }
    .button__feedback {
      display: flex;
      flex-wrap: nowrap;
    }
  }

  .ant-comment-content-author-name {
    color: #1f1f1f;
  }

  .ant-comment-avatar {
    cursor: initial;
  }
`;

export const Feedback__Content = styled.div`
  .order-modeling-product-feedback-item {
    &-attachment {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 4px;
      img {
        width: 80px;
        height: 80px;

        border-radius: 8px;
      }
    }
  }
`;
