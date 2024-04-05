import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Brand_wrapper = styled.div`
  .btn-add {
    position: absolute;
    top: -66px;
    z-index: 1;
    right: 20px;
  }
  .image_brands {
    .brands__card {
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
`;
