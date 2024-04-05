import { CloseOutlined } from '@ant-design/icons';

import styled from 'styled-components';

type Props = {
  mediaName?: string;
  mediaUrl?: string;
  mediaType?: string;
  onClose: () => void;
};

const ViewActionComponent = (props: Props) => {
  return (
    <ViewActionComponent_wrapper isShow={typeof props.mediaUrl === 'string'}>
      <Header_wrapper>
        <p className='title'>{props.mediaName}</p>

        <span className='btn-delete' onClick={() => props.onClose()}>
          <CloseOutlined />
        </span>
      </Header_wrapper>

      {props.mediaType?.startsWith('video') ? (
        <video className='w-100 h-100 media' controls>
          <source src={props.mediaUrl} />
          Your browser does not support HTML video.
        </video>
      ) : (
        <img src={props.mediaUrl} alt='' className='media' />
      )}
    </ViewActionComponent_wrapper>
  );
};
export default ViewActionComponent;

const ViewActionComponent_wrapper = styled.div<{ isShow: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 90%);
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? 1 : 0)};
  transition: all 150ms ease;

  .media {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Header_wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 0;
  z-index: 1;

  width: 100%;
  padding: 20px;

  .title {
    color: #fff;
    font-size: 16px;
  }

  .btn-delete {
    display: inline-flex;
    font-size: 26px;
    color: #fff;
    cursor: pointer;
  }
`;
