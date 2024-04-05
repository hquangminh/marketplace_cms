import { useRouter } from 'next/router';

import { ColumnsType } from 'antd/lib/table';
import { Badge } from 'antd';
import { CommentOutlined, MinusOutlined } from '@ant-design/icons';

import TableCustom from 'components/fragments/TableCustom';
import SortTypeFeedback from '../Fragment/SortTypeFeedback';
import RenderStatusFeedbackComponent from '../Fragment/RenderStatusFeedback';
import { ModelingListFeedback } from 'models/modeling-landing-page-product';
import Link from 'next/link';

type Props = {
  total: number;
  data: ModelingListFeedback[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  loading: boolean;
  setFilterType: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const ListFeedbackComponent = (props: Props) => {
  const router = useRouter();

  const columns: ColumnsType<ModelingListFeedback> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Order No',
      dataIndex: 'order_no',
      key: 'order_no',
      width: '10%',
      render: (_, record) => (
        <Link href={`/modeling-service/orders/view/${record.modeling_product?.modeling_order?.id}`}>
          <a>{record.modeling_product?.modeling_order?.order_no}</a>
        </Link>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (_, record) => record.modeling_product?.name || <MinusOutlined />,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (_, record) => `${record?.modeling_product.price} `,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => RenderStatusFeedbackComponent(status),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Badge dot={record.is_replied}>
          <CommentOutlined
            onClick={() => {
              router.push(
                `/modeling-service/orders/feedback/${record.modeling_product?.id}` +
                  '#' +
                  `${record?.id}`
              );
            }}
          />
        </Badge>
      ),
    },
  ];

  return (
    <>
      <SortTypeFeedback setPage={props.setPage} setFilterType={props.setFilterType} />
      <TableCustom
        loading={props.loading}
        data={props.data || undefined}
        columns={columns}
        rowKey='id'
        total={props.total}
        isPagination={props.total ? props.total > (props.pageSize || 0) : false}
        pageSize={props.pageSize}
        onChangePage={(page) => props.setPage(page)}
        width={800}
      />
    </>
  );
};
export default ListFeedbackComponent;
