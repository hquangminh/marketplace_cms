import React, { useMemo, useState } from 'react';

import { Button, Col, Row, Tree, Input, Empty } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { DirectoryTreeProps } from 'antd/lib/tree';

import categoryServices from 'services/category-services';
import blogServices from 'services/blog-services';
import helpServices from 'services/help-services';
import {
  handlerMessage,
  listToTree,
  onCheckErrorApiMessage,
  onToastNoPermission,
} from 'common/functions';

import Loading from 'components/fragments/Loading';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { categoryListsType, categoryPropsType, CategoryTree, typeImg } from 'models/category.model';

import CategoryEdit from './Edit';

import * as L from './style';

const { TreeNode }: categoryListsType | any = Tree;

const getParentKey = (key: string | any, tree: categoryListsType[]) => {
  let parentKey: string;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: categoryListsType) => item.parentid === key)) {
        parentKey = node.id || '';
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const initialValueTree: categoryListsType = {
  key: '',
  id: '',
  title: '',
  description: '',
  orderid: 0,
  parentid: '',
  status: true,
  isShow: false,
  children: [],
  isUpdate: false,
};

const Category = (props: categoryPropsType) => {
  const { categoryLists, loading, setCategory, allowAction, page } = props;

  const data: categoryListsType[] = categoryLists?.map((category: categoryListsType) => ({
    key: category.id,
    id: category.id,
    parentid: category.parentid,
    title: category.title,
    description: category.description,
    orderid: category.orderid,
    status: category.status,
    icon: category.icon,
  }));

  const defaultDataTree: CategoryTree[] | any = data
    ? listToTree(data, {
        idKey: 'id',
        parentKey: 'parentid',
        childrenKey: 'children',
      })
    : [];

  const [dataTable, setDataTable] = useState<categoryListsType[] | any>([initialValueTree]);
  const [activeMenu, setActiveMenu] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [valueEditor, setValueEditor] = useState<string>('');
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[] | null | any>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [filterDataTree, setFilterDataTree] = useState<categoryListsType[]>([]);
  const [fileList, setFileList] = useState<typeImg[] | any>([]);

  const [id, setId] = useState<string>('');

  const onSelect: DirectoryTreeProps['onSelect'] = (key, info: any) => {
    const regex = /(<([^>]+)>)/gi;

    if (info.selected) {
      const onCheckData = filterDataTree.find((node) => node.id === info.node.id);

      setActiveMenu(key);
      // delete info.node['children'];
      const newArr: any[] = [];
      info.node.title =
        (info.node.title?.props?.dangerouslySetInnerHTML?.__html &&
          info.node.title.props.dangerouslySetInnerHTML.__html.replace(regex, '')) ||
        (onCheckData && onCheckData.title);

      info.node.isUpdate = true;
      info.node.isShow = true;

      if (page !== 'category-blog') {
        setFileList([
          {
            image: info.node.icon,
            filename: info.node.icon
              ? info.node.icon?.split('/')[info.node.icon.split('/').length - 1]
              : info.node.image?.split('/')[info.node.image.split('/').length - 1],
            filetype: '',
          },
        ]);
      }

      newArr.push(info.node);

      setDataTable(newArr);
      if (!info.node.children?.length) {
        setId(info.node.id);
      } else {
        setId('');
      }

      return;
    }

    onResetForm();
  };

  const onResetForm = () => {
    setDataTable([initialValueTree]);
    setId('');
    setFileList([]);
    setActiveMenu([]);
  };

  const onAddCategory = () => {
    onResetForm();
    setDataTable([{ ...initialValueTree, isShow: true }]);
  };

  const onChangeData = (
    id: string,
    title: string,
    description: string,
    orderid: number,
    status: boolean,
    parentid: string,
    icon: string
  ) => {
    setDataTable([{ id, title, description, orderid, status, parentid, icon }]);
  };

  const onExpand = (newExpandedKeys: string[] | any) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  function locations(substring: string, string: string) {
    if (!string) return false;
    return substring.includes(string);
  }

  const filter = (array: CategoryTree[] | any, valueSearch: string) => {
    const getNodes = (result: CategoryTree[], object: any) => {
      if (locations(object.title.toLowerCase(), valueSearch)) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.children)) {
        const children = object.children.reduce(getNodes, []);
        if (children.length) result.push({ ...object, children });
      }
      return result;
    };

    return array.reduce(getNodes, []);
  };

  const onFilterCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const valueLower = value.toLowerCase();
    setSearchValue(value);
    setDataTable([
      {
        ...initialValueTree,
      },
    ]);

    setActiveMenu([]);
    setFileList([]);
    // setDefaultFileList([]);
    setFilterDataTree(filter(defaultDataTree, valueLower));

    const newExpandedKeys = categoryLists
      .map((item) => {
        if (locations(item.title.toLowerCase(), valueLower)) {
          return getParentKey(item?.parentid, data);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    if (value) {
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(true);
    }

    if (!value) {
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  const highLightSearch = useMemo(() => {
    if (!searchValue) {
      return defaultDataTree;
    }

    const loop = (data: CategoryTree[] | any) => {
      return data?.map((item: categoryListsType, index: number) => {
        if (!searchValue.trim()) {
          return <span key={index}>{item.title}</span>;
        }
        const strTitle = item.title as string;

        const normReq = searchValue
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .sort((a, b) => b.length - a.length);

        const final = strTitle.replace(
          new RegExp(`(${normReq.join('|')})`, 'gi'),
          (match) => '<mark>' + match + '</mark>'
        );

        if (item.children) {
          return {
            key: item.key,
            id: item.id,
            parentid: item.parentid,
            title: final,
            description: item.description,
            orderid: item.orderid,
            status: item.status,
            icon: item.icon,
            children: loop(item.children),
          };
        }

        return {
          key: item.key,
          id: item.id,
          parentid: item.parentid,
          title: item.title,
          description: item.description,
          orderid: item.orderid,
          status: item.status,
          icon: item.icon,
        };
      });
    };

    return loop(filterDataTree);
  }, [searchValue, filterDataTree, defaultDataTree]);

  const renderTreeNodes = (data: categoryListsType[]) =>
    data
      .sort((valueA, valueB) => valueA.orderid - valueB.orderid)
      .map((item: any) => {
        if (item.children) {
          return (
            <TreeNode
              title={<div dangerouslySetInnerHTML={{ __html: item.title }} />}
              key={item.key}
              id={item.id}
              parentid={item.parentid}
              description={item.description}
              orderid={item.orderid}
              status={item.status}
              icon={item.icon}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      });

  const onFetchDeleteCategory = async (id: string) => {
    setLoadingDelete(true);
    try {
      if (page === 'category-blog') {
        await blogServices.deleteCategoryBlog(id);
      } else if (page === 'help-category') {
        await helpServices.deleteHelpCategory(id);
      } else {
        await categoryServices.deleteCategory(id);
      }

      setLoadingDelete(false);
      const newData = categoryLists.filter((item) => item.id !== id);
      setFilterDataTree((prev: any) => prev.filter((category: any) => category.id !== id));
      setCategory(newData);
      onResetForm();
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoadingDelete(false);
    }
  };

  const onDelete = () => {
    onFetchDeleteCategory(id);
  };

  return (
    <L.CategoryWrapper>
      {loading ? <Loading isOpacity /> : ''}
      <Row gutter={32}>
        <Col span={6} className='gutter-row position-relative left'>
          {loadingDelete ? <Loading isOpacity /> : ''}
          <p className='title'>Category List</p>

          <L.BntAction>
            <Button
              htmlType='submit'
              onClick={allowAction?.add ? onAddCategory : onToastNoPermission}>
              Create
            </Button>

            <Button
              htmlType='submit'
              danger
              disabled={!id}
              onClick={
                allowAction?.remove ? () => showConfirmDelete('', onDelete) : onToastNoPermission
              }>
              Delete
            </Button>
          </L.BntAction>

          <Input placeholder='Search' onChange={onFilterCategory} />

          <div className={'category_list' + (!data?.length ? ' justify-content-center' : '')}>
            {data?.length > 0 ? (
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                onExpand={onExpand}
                onSelect={allowAction?.read || allowAction?.add ? onSelect : onToastNoPermission}
                selectedKeys={activeMenu}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                // treeData={highLightSearch}
                className={highLightSearch[0]?.key === '0' ? 'd-none' : ''}>
                {renderTreeNodes(highLightSearch)}
              </Tree>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Category' />
            )}
          </div>
        </Col>

        <Col span={18} className='gutter-row'>
          <p className='title'>Category Detail</p>
          <CategoryEdit
            setFilterDataTree={setFilterDataTree}
            allowAction={allowAction}
            onChangeData={onChangeData}
            dataTable={dataTable}
            setActiveMenu={setActiveMenu}
            initialValueTree={initialValueTree}
            setDataTable={setDataTable}
            fileList={fileList}
            setFileList={setFileList}
            onResetForm={onResetForm}
            setExpandedKeys={setExpandedKeys}
            valueEditor={valueEditor}
            setValueEditor={setValueEditor}
            categoryLists={categoryLists}
            setCategory={setCategory}
            page={props.page}
            setId={setId}
          />
        </Col>
      </Row>
    </L.CategoryWrapper>
  );
};

export default Category;
