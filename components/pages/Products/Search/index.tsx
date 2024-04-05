import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';

import { Pagination, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import {
  changeToSlug,
  formatNumber,
  handlerMessage,
  listToTree,
  onCheckErrorApiMessage,
  onToastNoPermission,
} from 'common/functions';
import { ProductFileFormat } from 'common/constant';

import config from 'config';

import categoryServices from 'services/category-services';
import productServices from 'services/product-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';
import MenuAction from 'components/fragments/MenuAction';
import Icon from 'components/fragments/Icons';

import { ProductModel, ProductComponentType } from 'models/product.model';
import { DataSearch, SearchModel } from 'models/table.model';

type ValueFilter = {
  title: string;
  category: string[] | string | undefined;
  format: string[];
  minPrice: number | null;
  maxPrice: number | null;
  others: string[];
  sort: string | null;
  page: number;
  status: number | null;
};

const ProductSearchComponent = (props: ProductComponentType) => {
  const [category, setCategory] = useState<DataSearch[] | null>(null);
  const [categoryTree, setCategoryTree] = useState<DataSearch[] | null>(null);
  const [valueSearch, setValueSearch] = useState<ValueFilter>({
    title: '',
    category: undefined,
    format: [],
    minPrice: null,
    maxPrice: null,
    others: [],
    sort: null,
    page: 1,
    status: null,
  });

  useEffect(() => {
    const fetchDataCategory = async () => {
      const res = await categoryServices.getAllCategory();

      if (!res.error) {
        setCategory(res.data);
        setCategoryTree(listToTree([...res.data]));
      }
    };
    fetchDataCategory();
  }, []);

  const onDeleteTemporaryProduct = async (id: string) => {
    try {
      const resp = await productServices.deleteTemporary(id);

      if (!resp.error) {
        if (props.setProducts) {
          props.setProducts((prevState: any) =>
            (prevState || []).filter((item: any) => item.id !== id)
          );
        }

        handlerMessage('Delete temporary success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const getStatusTagStyle = (value: any) => {
    const styles: React.CSSProperties = {
      margin: 0,
      minWidth: '65px',
      borderRadius: '4px',
      fontSize: '12px',
      padding: '2px 10px',
      border: 0,
      textAlign: 'center',
    };

    if (value === 1) {
      styles.backgroundColor = '#369ca5';
      styles.color = '#fefefe';
    } else if (value === 5) {
      styles.backgroundColor = '#8c8c8c';
      styles.color = '#ffffff';
    } else if (value === 7) {
      styles.backgroundColor = '#ff4d4f';
      styles.color = '#ffffff';
    }

    return styles;
  };
  const columns: ColumnsType<ProductModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => (
        <div>{index + 1 + (valueSearch.page - 1) * (props.pageSize || 10)}</div>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
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
      render: (text) => text,
      ellipsis: true,
      width: 400,
    },
    {
      title: 'PBR',
      dataIndex: 'is_pbr',
      key: 'is_pbr',
      align: 'center',
      render: (value) => <StatusCheck checked={value} />,
    },
    {
      title: 'Animated',
      dataIndex: 'is_animated',
      key: 'is_animated',
      align: 'center',
      render: (value) => <StatusCheck checked={value} />,
    },
    {
      title: 'Rigged',
      dataIndex: 'is_rigged',
      key: 'is_rigged',
      align: 'center',
      render: (value) => <StatusCheck checked={value} />,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (value) => (value === 0 ? <Tag color='#6db2c5'>Free</Tag> : formatNumber(value, '$')),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        return (
          <>
            <Tag style={getStatusTagStyle(value)}>
              {value === 1 ? 'Publish' : value === 7 ? 'Hide' : 'Draft'}
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          label={{ edit: <Link href={`/products/edit/${record.id}`}>Edit</Link> }}
          contentDelete={{ content: 'After delete, will switch to temporary.' }}
          handleEdit={props.allowAction?.add ? () => null : onToastNoPermission}
          handleDelete={
            props.allowAction?.remove
              ? () => onDeleteTemporaryProduct(record.id)
              : onToastNoPermission
          }
          handleView={() =>
            window.open(
              `${config.urlWeb}/product/${changeToSlug(record.title)}--${record.id}`,
              '_blank'
            )
          }
        />
      ),
    },
  ];

  const onChangeSearch = (key: any, value: any) => {
    setValueSearch((s) => ({ ...s, [key]: value }));
  };

  const searchColumn: Array<SearchModel> = [
    {
      key: 'title',
      title: 'Product name',
      placeholder: 'Product name',
      type: 'input',
      value: valueSearch.title,
      width: { span: 24, xl: 8, sm: 12 },
      onChange: onChangeSearch,
    },
    {
      key: 'category',
      title: 'Category',
      placeholder: 'Please Select Category',
      type: 'tree-select-multi',
      width: { span: 24, xl: 8, sm: 12 },
      value: valueSearch.category,
      data: categoryTree,
      onChange: onChangeSearch,
    },
    {
      key: 'format',
      title: 'Formats',
      placeholder: 'Please Select Formats',
      type: 'select-multi',
      width: { span: 24, xl: 8, sm: 12 },
      value: valueSearch.format,
      data: ProductFileFormat,
      onChange: onChangeSearch,
    },
    {
      key: 'minPrice',
      title: 'Price',
      type: 'input-group',
      width: { span: 24, xl: 8, sm: 12 },
      boxChildren: [
        {
          key: 'minPrice',
          suffix: '$',
          placeholder: 'From',
          type: 'input-number',
          value: valueSearch.minPrice,
          onChange: onChangeSearch,
        },
        {
          key: 'maxPrice',
          suffix: '$',
          placeholder: 'To',
          type: 'input-number',
          value: valueSearch.maxPrice,
          onChange: onChangeSearch,
        },
      ],
    },
    {
      key: 'sort',
      title: 'Sort',
      placeholder: 'Select to sort',
      type: 'select',
      width: { span: 24, xl: 8, sm: 12 },
      value: valueSearch.sort,
      data: [
        { title: 'Lower price', label: 'Lower price', value: 'price_asc' },
        { title: 'Higher price', label: 'Higher price', value: 'price_desc' },
      ],
      onChange: onChangeSearch,
    },
    {
      key: 'status',
      title: 'Status',
      placeholder: 'Select to sort',
      type: 'select',
      width: { span: 24, xl: 8, sm: 12 },
      value: valueSearch.status,
      data: [
        { title: 'Publish', label: 'Publish', value: 1 },
        { title: 'Draft', label: 'Draft', value: 5 },
      ],
      onChange: onChangeSearch,
    },
    {
      key: 'others',
      title: 'Others',
      placeholder: 'Please Select Category',
      type: 'checkbox-group',
      width: { span: 24, xl: 8, sm: 12 },
      value: valueSearch.others,
      data: [
        { title: '', label: 'PBR', value: 'is_pbr' },
        { title: '', label: 'Animated', value: 'is_animated' },
        { title: '', label: 'Rigged', value: 'is_rigged' },
      ],
      onChange: onChangeSearch,
    },
  ];

  const onSearch = async (page?: number) => {
    try {
      let paramFilter = { ...valueSearch };
      if (paramFilter.category && typeof paramFilter.category === 'string') {
        const getCate = (parentID: string, result: Array<string> = []) => {
          category
            ?.filter((i) => i.parentid === parentID)
            .forEach((cate) => {
              if (cate.id) result.push(cate.id);
              if (category.filter((i) => i.parentid === cate.id).length > 0 && cate.id)
                getCate(cate.id, result);
            });
          return result.filter(function (id, index, self) {
            return index === self.indexOf(id);
          });
        };
        paramFilter.category = [
          paramFilter.category.split('__')[0],
          ...getCate(paramFilter.category.split('__')[0]),
        ];
      }

      props.onSearch &&
        (await props.onSearch({ ...paramFilter, page: typeof page === 'number' ? page : 1 }));
      setValueSearch((v) => ({ ...v, page: typeof page === 'number' ? page : 1 }));
    } catch (error) {
      console.log('error', error);
    }
  };

  const onReset = () => {
    setValueSearch((v) => ({
      ...v,
      title: '',
      category: undefined,
      format: [],
      minPrice: null,
      maxPrice: null,
      others: [],
      sort: null,
      page: 1,
      status: null,
    }));
    props.onSearch && props.onSearch({});
  };

  return (
    <Fragment>
      <TableCustom
        loading={props.loading}
        columns={columns}
        data={props.products || undefined}
        rowKey='id'
        key={'product'}
        searchColumn={searchColumn}
        total={props.totalProducts}
        pageSize={props.pageSize}
        width={800}
        onSearch={onSearch}
        onReset={onReset}
      />
      {props.products &&
        props.totalProducts &&
        props.pageSize &&
        props.totalProducts > props.pageSize && (
          <Pagination
            className='mt-4 text-right'
            current={valueSearch.page}
            total={props.totalProducts}
            onChange={(page) => onSearch(page)}
            showSizeChanger={false}
          />
        )}
    </Fragment>
  );
};

export default ProductSearchComponent;
