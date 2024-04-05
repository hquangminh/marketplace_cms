import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

export const Step_wrapper = styled.div`
  .btn-add {
    position: absolute;
    top: -66px;
    z-index: 1;
    right: 20px;
  }
  .image_step {
    .step__card {
      aspect-ratio: 1.6;
      width: 200px;
      display: inline-flex;
      align-items: center;
      border: 1px solid #eee;
      ${maxMedia.custom(1440)} {
        width: 100px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .description_step {
    word-break: break-word;
    line-height: 1.2;
    ${maxMedia.custom(1440)} {
      width: 800px;
    }
  }
  .title_step {
    word-break: break-word;
    line-height: 1.2;
    ${maxMedia.custom(1440)} {
      width: 500px;
    }
  }
  .status_step {
    width: 250px;
  }
  .action_step {
    width: 150px;
  }
`;
