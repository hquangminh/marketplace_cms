import styled from 'styled-components';

export const Media_Wrapper = styled.div`
  padding: 20px;
  position: relative;

  .header-filter {
    .ant-select-selector,
    .ant-input {
      height: 36px;
    }
  }

  .media__img {
    display: inline-flex;
    align-items: center;

    border: 1px solid #eee;

    img {
      max-width: 200px;
      max-height: 100px;
      object-fit: contain;
    }

    video {
      max-width: 200px;
      max-height: 100px;
      object-fit: contain;
    }
  }

  .ant-typography {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;

    margin-bottom: 0;

    .ant-typography-copy {
      margin-right: 5px;
      .anticon {
        display: flex;
      }
    }
  }

  .btn-add {
    position: absolute;
    top: -46px;
    z-index: 1;
    right: 20px;
  }

  .box__search {
    .ant-input-search-button {
      pointer-events: none;
    }
  }
`;
