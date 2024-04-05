import React, { Fragment, useState } from 'react';
import Link from 'next/link';

import type { ColumnsType } from 'antd/lib/table';

import { theme } from 'common/constant';
import { formatNumber, onToastNoPermission } from 'common/functions';

import { OrderItemType, OrderComponentType } from 'models/order.model';

import StatusOrder from 'components/fragments/StatusOrder';
import TableCustom from 'components/fragments/TableCustom';

const OrderNewest = (props: OrderComponentType) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);

  const columns: ColumnsType<OrderItemType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Order No',
      dataIndex: 'order_no',
      key: 'order_no',
      render: (text, record) =>
        props?.allowAction?.read ? (
          <Link href={'/orders/' + record.id}>
            <a style={{ color: theme.primary_color }}>#{text}</a>
          </Link>
        ) : (
          <p
            style={{ color: theme.primary_color, cursor: 'pointer' }}
            onClick={onToastNoPermission}>
            #{text}
          </p>
        ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text) => formatNumber(text, '$'),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Method',
      dataIndex: 'paygate',
      key: 'paygate',
      align: 'center',
      render: (text, record) => {
        if (record.status === 4) {
          return null;
        } else {
          return <p>{text || '-'}</p>;
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text) => <StatusOrder status={text} type='tag' />,
    },
    {
      title: 'Customer',
      dataIndex: 'market_user',
      key: 'market_user',
      ellipsis: true,
      render: (text, record) =>
        props.allowAction?.readUser ? (
          <Link href={'/users/' + record.market_user.id}>
            <a style={{ color: theme.primary_color }}>{record.market_user.name}</a>
          </Link>
        ) : (
          <p
            style={{ color: theme.primary_color, cursor: 'pointer' }}
            onClick={onToastNoPermission}>
            {record.market_user.name}
          </p>
        ),
    },
  ];

  return (
    <Fragment>
      <TableCustom
        loading={props.loading}
        columns={columns}
        data={props.data}
        rowKey='id'
        width={800}
        isPagination={props.data && props.data.length > pageSize}
        total={props.data?.length || 0}
        pageSize={pageSize}
        isChangePageSize={false}
        onChangePageSize={(pageSize) => setPageSize(pageSize)}
        onChangePage={(page) => setPage(page)}
      />
    </Fragment>
  );
};

export default OrderNewest;
