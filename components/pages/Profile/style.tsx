import { theme } from 'common/constant';
import styled from 'styled-components';

export const Profile_Wrapper = styled.div`
  padding: 20px;
  position: relative;
`;
export const Profile_ChangeInfo = styled.div`
  padding: 20px 20px 15px;
  position: relative;

  border-radius: 3px;
  background-color: #fff;

  .field-upload {
    .ant-form-item-control-input-content {
      display: flex;
      justify-content: center;

      .ant-upload-picture-card-wrapper {
        width: fit-content;

        div.ant-upload {
          width: 150px;
          height: 150px;
          margin: 0;
          border-radius: 50%;
        }

        .image_wrapper {
          border-radius: 50%;
          .btn-upload {
            position: absolute;
            right: 5px;
            bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            width: 30px;
            height: 30px;
            color: ${theme.primary_color};
            background-color: #fff;
            box-shadow: 0px 1px 4px #0000005c;
          }
          img {
            object-fit: cover;
          }
        }
      }
    }
  }
  .list_permission {
    .ant-checkbox-wrapper {
      pointer-events: none;
    }
  }
`;
export const Profile_ChangePW = styled.div`
  padding: 10px 20px 15px;
  position: relative;

  border-radius: 3px;
  background-color: #fff;

  .ant-typography {
    color: #555;
  }
`;
