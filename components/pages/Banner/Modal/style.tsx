import { theme } from 'common/constant';
import styled from 'styled-components';

export const ModalComponent_wrapper = styled.div`
  .ant-upload {
    width: 100%;
  }
`;

export const PreviewIMG = styled.div`
  position: relative;

  max-height: 300px;
  margin: 0 auto;

  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #eee;

  img {
    object-fit: contain;
    object-position: top;
    border-radius: 5px;
  }

  .btn-delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 25px;
    height: 25px;
    color: #fff;
    background-color: ${theme.primary_color};
    border-radius: 0 5px 0 5px;
    cursor: pointer;
  }
`;
