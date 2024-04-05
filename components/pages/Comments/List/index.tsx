import { Button } from 'antd';
import Link from 'next/link';

import { ColumnsType } from 'antd/lib/table';

import TableCustom from 'components/fragments/TableCustom';

import { CommentListComponentProps } from 'models/comment.model';
import { ProductModel } from 'models/product.model';

import * as L from './style';

const CommentListComponent = (props: CommentListComponentProps) => {
  const { pageSize, page, loading, setPage, data } = props;

  const columns: ColumnsType<ProductModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: (text, record, index) => index + 1 + (page - 1) * pageSize,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (url, record) => (
        <img src={url} alt={record.title} width='60' style={{ aspectRatio: '1 / 1' }} />
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
      title: 'Total Comments',
      dataIndex: 'totalComment',
      key: 'totalComment',
      render: (_, record) => record.totalComment.aggregate.count,
      sorter: (a, b) => a.totalComment.aggregate.count - b.totalComment.aggregate.count,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type='default'
          className='btn__viewdetail'
          disabled={!record.totalComment?.aggregate.count}>
          <Link href={`comments/${record.id}`}>
            <a>View Detail</a>
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <L.CommentLists_wrapper>
      <TableCustom
        loading={loading}
        columns={columns}
        data={data || []}
        rowKey='id'
        isPagination={data ? data.length > pageSize : false}
        pageSize={pageSize}
        onChangePage={(page) => setPage(page)}
        width={800}
      />
    </L.CommentLists_wrapper>
  );
};

export default CommentListComponent;
