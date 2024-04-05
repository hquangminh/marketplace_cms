import React from 'react';
import { useRouter } from 'next/router';

import { Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import {
  formatNumber,
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
  searchDebounce,
} from 'common/functions';

import productServices from 'services/product-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';
import MenuAction from 'components/fragments/MenuAction';
import Icon from 'components/fragments/Icons';

import { ProductModel } from 'models/product.model';
import { PageAllowActionType } from 'models/common.model';

import styled from 'styled-components';

type Props = {
  allowAction?: PageAllowActionType;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  products: ProductModel[] | null;
  totalProducts?: number;
  pageSize?: number;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (value: any) => void;
  setProductLists?: React.Dispatch<
    React.SetStateAction<{
      total: number;
      data: ProductModel[] | null;
    }>
  >;
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  path?: 'temporary' | '';
};

const ProductListComponent = (props: Props) => {
  const router = useRouter();

  const onDeleteTemporaryProduct = async (id: string) => {
    try {
      const resp = await productServices.deleteTemporary(id);

      if (!resp.error) {
        if (props.setProductLists) {
          props.setProductLists((prevState) => ({
            total: prevState.total - 1,
            data: (prevState?.data || []).filter((item) => item.id !== id),
          }));
        }

        handlerMessage('Delete temporary success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const onDeleteProduct = async (id: string) => {
    try {
      const resp = await productServices.deleteProduct(id);

      if (!resp.error) {
        if (props.setProductLists) {
          props.setProductLists((prevState) => ({
            total: prevState.total - 1,
            data: (prevState?.data || []).filter((item) => item.id !== id),
          }));
        }

        handlerMessage('Delete success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const onResotoreProduct = async (id: string) => {
    try {
      const resp = await productServices.restoreProduct(id);

      if (!resp.error) {
        if (props.setProductLists) {
          props.setProductLists((prevState) => ({
            total: prevState.total - 1,
            data: (prevState?.data || []).filter((item) => item.id !== id),
          }));
        }

        handlerMessage('Restore success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<ProductModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: (__, _, index) => index + 1 + (props.page - 1) * (props.pageSize || 0),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      align: 'center',
      render: (url, record) =>
        url ? (
          <img src={url} alt={record.title} width='60' style={{ aspectRatio: '1 / 1' }} />
        ) : (
          <Icon iconName='minus-line' color='#cccccc' />
        ),
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text) => text,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        return (
          <>
            {value === 1 && <Tag className='status status-2'>Publish</Tag>}
            {value === 5 && <Tag className='status status-1'>Draft</Tag>}
            {value === 7 && <Tag className='status status-3'>Hide</Tag>}
          </>
        );
      },
    },
    {
      title: 'PBR',
      dataIndex: 'is_pbr',
      key: 'is_pbr',
      align: 'center',
      render: (value) => <StatusCheck checked={value} />,
      sorter: (a, b) => (a.is_pbr === b.is_pbr ? 0 : a.is_pbr ? -1 : 1),
    },
    {
      title: 'Animated',
      dataIndex: 'is_animated',
      key: 'is_animated',
      className: 'text-center',
      render: (value) => <StatusCheck checked={value} />,
      sorter: (a, b) => (a.is_animated === b.is_animated ? 0 : a.is_animated ? -1 : 1),
    },
    {
      title: 'Rigged',
      dataIndex: 'is_rigged',
      key: 'is_rigged',
      align: 'center',
      render: (value) => <StatusCheck checked={value} />,
      sorter: (a, b) => (a.is_rigged === b.is_rigged ? 0 : a.is_rigged ? -1 : 1),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (value) => (value === 0 ? <Tag color='#6db2c5'>Free</Tag> : formatNumber(value, '$')),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) =>
        props.path === 'temporary' ? (
          <MenuAction
            data={record}
            handleRestore={
              props.allowAction?.remove ? () => onResotoreProduct(record.id) : onToastNoPermission
            }
            contentRestore={{ title: 'Restore product' }}
            handleDelete={
              props.allowAction?.remove ? () => onDeleteProduct(record.id) : onToastNoPermission
            }
            contentDelete={{
              content: `If you delete it, you can't restore it.`,
            }}
          />
        ) : (
          <MenuAction
            data={record}
            handleView={
              props.allowAction?.read
                ? () => router.push(`/products/view/${record.id}`)
                : onToastNoPermission
            }
            handleEdit={
              props.allowAction?.add
                ? () => router.push(`/products/edit/${record.id}`)
                : onToastNoPermission
            }
            contentDelete={{ content: 'After delete, will switch to temporary.' }}
            handleDelete={
              props.allowAction?.remove
                ? () => onDeleteTemporaryProduct(record.id)
                : onToastNoPermission
            }
          />
        ),
    },
  ];

  return (
    <ProductListComponent_wrapper>
      <Input
        className='mb-3'
        placeholder='Enter name'
        onChange={searchDebounce((e) => {
          props.setPage(1);
          props.setName(e.target.value.trim());
        })}
      />
      <TableCustom
        loading={props.loading}
        columns={columns}
        data={props.products || []}
        total={props.total}
        page={props.page}
        rowKey='id'
        isPagination={props.total ? props.total > (props.pageSize || 0) : false}
        pageSize={props.pageSize}
        onChangePage={(page) => props.setPage(page)}
        width={800}
      />
    </ProductListComponent_wrapper>
  );
};

const ProductListComponent_wrapper = styled.div`
  .status {
    margin: 0;
    min-width: 65px;
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 10px;
    border: 0;
    text-align: center;

    &-1 {
      background-color: #8c8c8c;
      color: #ffffff;
    }

    &-2 {
      background-color: #369ca5;
      color: #fefefe;
    }
    &-3 {
      background-color: #ff4d4f;
      color: #fff;
    }
  }
`;

export default ProductListComponent;
