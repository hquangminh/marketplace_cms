import styled from 'styled-components';

export const CategoryWrapper = styled.div`
  position: relative;

  .left {
    display: flex;
    flex-direction: column;
  }

  .category_list {
    display: flex;
    flex-direction: column;

    flex: auto;
    min-height: 400px;
    max-height: 614px;
    margin-top: 10px;
    padding: 5px;
    overflow-y: auto;
    border: 1px solid #eee;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: #5555554e;
  }

  .ant-tree {
    .ant-tree-treenode {
      width: 100%;

      .ant-tree-node-content-wrapper {
        flex: auto;
      }
    }
  }

  .ant-tree-iconEle {
    display: none !important;
  }

  .title {
    margin-bottom: 30px;
    font-weight: 500;
  }

  .ant-tree-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  mark {
    background: yellow;
  }
`;
export const BntAction = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  padding-bottom: 10px;

  .ant-btn {
    width: calc(50% - 5px);
    max-width: 140px;
  }
`;
