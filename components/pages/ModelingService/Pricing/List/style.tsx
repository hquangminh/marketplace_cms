import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

export const Price_wrapper = styled.div`
  .btn-add {
    position: absolute;
    top: -66px;
    z-index: 1;
    right: 20px;
  }
  .title_price {
    word-break: break-word;
    line-height: 1.2;
    ${maxMedia.custom(1440)} {
      width: 250px;
    }
  }
  .status_price {
    width: 300px;
    white-space: nowrap;
    ${maxMedia.custom(1440)} {
      width: 100px;
    }
  }
`;
