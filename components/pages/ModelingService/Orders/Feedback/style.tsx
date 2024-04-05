import styled from 'styled-components';

export const OrderFeedbackComponent_wrapper = styled.div`
  .order-modeling-feedback-total {
    font-size: 24px;
    color: #1f1f1f;
  }
  .btn-feedback {
    border-radius: 3px;
  }
  .title-product {
    font-size: 20px;
  }
  .product-detail {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: bold;
      font-size: 15px;
      span {
        font-weight: normal;
        font-size: 14px;
      }
    }
    .image_product {
      img {
        width: 300px;
        height: 300px;
      }
    }
  }
  position: relative;
  .ant-spin-spinning {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;
