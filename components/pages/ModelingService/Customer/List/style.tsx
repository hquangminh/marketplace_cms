import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

export const Customer_wrapper = styled.div`
  .btn-add {
    position: absolute;
    top: -66px;
    z-index: 1;
    right: 20px;
  }
  .image_customer {
    .customer__card {
      aspect-ratio: 1.6;
      width: 200px;
      display: inline-flex;
      align-items: center;
      border: 1px solid #eee;
      img {
        width: 100%;
        height: 100%;
        ${maxMedia.custom(1440)} {
          width: 400px;
        }
      }
    }
  }
  .description_customer {
    word-break: break-word;
    line-height: 1.2;
    ${maxMedia.custom(1440)} {
      width: 500px;
    }
  }
  .title_customer {
    word-break: break-word;
    line-height: 1.2;
    ${maxMedia.custom(1440)} {
      width: 500px;
    }
  }
  .status_customer {
    width: 250px;
  }
  .action_customer {
    width: 150px;
  }
`;
