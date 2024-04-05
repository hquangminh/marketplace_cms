import styled from 'styled-components';

export const Table_Wrapper = styled.div`
  .ant-table-cell {
    line-height: 1.4;
    word-break: break-word;
  }
  .tag__permis {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    max-width: 220px;
    span {
      display: inline-block;
      min-width: 62.5px;
      margin-right: 0;
      text-align: center;
    }
  }
`;

export const SearchItem = styled.div`
  .title {
    display: block;
    margin-bottom: 5px;

    font-size: 14px;
  }
  & > .ant-input-group {
    display: flex;
  }
  .ant-input-group-addon {
    min-width: 50px;
  }
  .ant-checkbox-group {
    min-height: 32px;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
`;
