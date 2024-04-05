import { theme } from 'common/constant';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 15px 20px;
`;
export const UserInfo = styled.div`
  display: flex;

  background-color: #ffffff;

  .left {
    display: flex;
    align-items: center;

    width: 200px;
    padding: 10px;
    border-right: 1px solid #eee;

    .ant-avatar {
      width: 160px;
      height: 160px;
      margin: 0 auto;
      padding: 5px;

      font-size: 40px;
      border: 1px solid #eee;
      background: transparent;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        border-radius: 50%;
        background-color: #eee;

        .anticon {
          color: #6db2c5;
        }
      }

      img {
        border-radius: 50%;
      }
    }
  }
  .right {
    flex: auto;

    .info-group {
      padding: 30px 20px;

      & + .info-group {
        border-top: 1px solid #eee;
      }
      &_name {
        font-size: 16px;
        color: ${theme.primary_color};
      }
      &_content {
        display: flex;
        flex-wrap: wrap;
        gap: 30px 10px;

        margin-top: 15px;

        color: rgba(0, 0, 0, 0.85);

        &-item {
          width: calc(100% / 3 - 20px);

          display: flex;
          flex-direction: column;
          gap: 5px;

          span {
            font-size: 14px;
            font-weight: 500;

            &.ant-tag {
              height: fit-content;
              width: fit-content;
            }
          }
          p {
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
  }
`;
export const TableOrder = styled.div`
  margin-top: 20px;
`;
