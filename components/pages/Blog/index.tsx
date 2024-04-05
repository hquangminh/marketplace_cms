import { useState } from 'react';
import moment from 'moment';
import { Image } from 'antd';

import { useRouter } from 'next/router';

import { CheckCircleTwoTone, LineOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table/interface';

import blogServices from 'services/blog-services';

import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';

import {
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
  searchDebounce,
} from 'common/functions';

import { BlogListComponentProps } from 'models/blog.modes';

import styled from 'styled-components';

const pageSize = 10;

const BlogListComponent = (props: BlogListComponentProps) => {
  const { loading, allowAction, setData, data, setLoading, onChangeSearch } = props;

  const router = useRouter();

  const [page, setPage] = useState(1);

  const onFetchDeleteBlog = async (id: string) => {
    setLoading(true);
    try {
      await blogServices.deleteBlog(id);
      setData((prevState) => prevState.filter((p) => p.id !== id));
      handlerMessage('Delete success', 'success');
      setLoading(false);
    } catch (error: any) {
      onCheckErrorApiMessage(error);

      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 6,
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 10,
      render: (src) => (
        <Image
          alt=''
          src={src || 'error'}
          fallback='/static/images/image-not-found.webp'
          preview={false}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 35,
      className: 'Blog_Name',
    },
    { title: 'Slug', dataIndex: 'slug', key: 'slug', width: 15 },
    {
      title: 'Publish',
      dataIndex: 'is_publish',
      key: 'is_publish',
      align: 'center',
      width: 8,
      render: (value) =>
        !value ? <LineOutlined /> : <CheckCircleTwoTone twoToneColor='#52c41a' />,
      sorter: (a, b) => a.is_publish - b.is_publish,
    },
    {
      title: 'Create date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 14,
      render: (text) => (
        <div>
          <p>{moment(text).format('H:mm A')}</p>
          <p>{moment(text).format('DD-MM-YYYY')}</p>
        </div>
      ),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: 10,
      render: (_, record) => (
        <MenuAction
          data={record}
          handleEdit={
            allowAction.add ? () => router.push(`/blog/edit/${record.id}`) : onToastNoPermission
          }
          contentDelete={{ title: 'Are you sure delete this blog?', content: `${record.name}` }}
          handleDelete={
            allowAction.remove ? () => onFetchDeleteBlog(record.id) : onToastNoPermission
          }
        />
      ),
    },
  ];

  const onChangeBlogName = searchDebounce((value) => onChangeSearch(value), 500);

  return (
    <Blog_wrapper>
      <TableCustom
        searchColumn={[
          {
            title: 'Blog name',
            type: 'input',
            width: { span: 24, lg: 12 },
            onChange: (_, value) => onChangeBlogName(value),
          },
        ]}
        onChangePage={(page) => setPage(page)}
        columns={columns}
        page={page}
        loading={loading}
        rowKey='id'
        data={data}
        isPagination={props.data && props.data.length > pageSize}
        width={850}
      />
    </Blog_wrapper>
  );
};

const Blog_wrapper = styled.div`
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
  .anticon.anticon-check-circle {
    font-size: 18px;
  }
`;

export default BlogListComponent;
