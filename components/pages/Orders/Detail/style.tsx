import styled from 'styled-components';

import { theme } from 'common/constant';

export const Wrapper = styled.div`
  padding: 20px 15px;

  .price__row {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    .old__price {
      color: #bfbfbf;
      text-decoration: line-through;
    }
  }
`;
export const InfoItem = styled.div`
  position: relative;
  padding-left: 25px;
  padding-top: 2px;

  .my-icon {
    position: absolute;
    top: 0;
    left: 0;

    width: 16px;
    color: ${theme.primary_color};
  }

  .title {
    font-size: 15px;
    line-height: 1;
    font-weight: 500;
  }
  .value {
    margin-top: 8px;
    font-size: 15px;
    color: #666;

    a {
      color: #666;
      text-decoration: underline;
    }
  }
`;
export const CustomerInfo = styled.div`
  padding: 20px;
  background-color: #fff;

  h4 {
    margin-bottom: 20px;
    font-size: 17px;
    color: rgb(109, 178, 197);
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    & > div {
      width: calc(33.33% - (40px / 3));
    }
  }
`;
export const OrderInfo = styled(CustomerInfo)`
  border-top: 1px solid #eee;
`;
export const ProductTable = styled.div`
  padding-bottom: 8px;
  margin-top: 20px;

  background-color: #fff;

  .product-name {
    color: ${theme.primary_color};
  }
`;
export const PriceItem = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  width: 500px;

  padding: 16px 0;
  margin-left: auto;
  margin-right: 16px;

  &:not(:last-child) {
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }

  p {
    line-height: 1;
    &:first-child {
      font-size: 14px;
      font-weight: 500;
    }
    &:last-child {
      font-size: 16px;
      font-weight: 600;

      &.discount {
        color: #b10902;
      }
      &.total {
        color: ${theme.primary_color};
      }
    }
  }

  &.payment__method {
    .my-icon {
      width: 43px;
      color: #1a2adf;
    }
  }
`;

export const TotalWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  .total__date {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;

    p {
      font-size: 14px;
      color: var(--color-gray-9);

      span {
        color: var(--color-gray-11);
        font-weight: 500;
      }
    }
  }
`;
