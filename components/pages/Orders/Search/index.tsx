import React, { Fragment, useState } from 'react';
import Link from 'next/link';

import moment from 'moment';
import { message } from 'antd';
import * as AntIcon from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';

import { theme } from 'common/constant';
import { formatNumber, onToastNoPermission } from 'common/functions';

import { OrderItemType, OrderSearchComponentType, OrderSearchParamType } from 'models/order.model';
import { SearchModel } from 'models/table.model';

import Icon from 'components/fragments/Icons';
import TableCustom from 'components/fragments/TableCustom';
import StatusOrder from 'components/fragments/StatusOrder';

const pageSize = 10;

const OrderSearch = (props: OrderSearchComponentType) => {
  const [page, setPage] = useState(1);
  const [valueSearch, setValueSearch] = useState<OrderSearchParamType>({
    receipt: '',
    dates: ['', ''],
    start: '',
    end: '',
  });

  const onChangeSearch = (key: any, value: any) => {
    setValueSearch((s) => ({ ...s, [key]: value }));
  };

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
    { title: 'Method', dataIndex: 'paygate', key: 'paygate', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text) => <StatusOrder status={text} />,
    },
    {
      title: 'Receipt',
      dataIndex: 'receipt_url',
      key: 'receipt_url',
      align: 'center',
      render: (text) =>
        text ? (
          <a href={text} target='__blank'>
            <AntIcon.EyeFilled style={{ color: theme.primary_color }} />
          </a>
        ) : (
          <Icon iconName='minus-line' color='#cccccc' />
        ),
    },
    {
      title: 'Customer',
      dataIndex: 'market_user',
      key: 'market_user',
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

  const searchColumn: Array<SearchModel> = [
    {
      key: 'order_no',
      title: 'Order No',
      placeholder: 'Input Order no',
      type: 'input',
      value: valueSearch.order_no,
      width: { xl: 8, span: 24 },
      onChange: onChangeSearch,
    },
    {
      key: 'receipt',
      title: 'Receipt',
      placeholder: 'Input Receipt',
      type: 'input',
      value: valueSearch.receipt,
      width: { xl: 8, span: 24 },
      onChange: onChangeSearch,
    },
    {
      key: 'dates',
      title: 'Date',
      type: 'range-picker',
      blockDateFuture: true,
      value: valueSearch.dates,
      width: { xl: 8, span: 24 },
      onChange: onChangeSearch,
    },
  ];

  const onSearch = () => {
    try {
      if (
        !valueSearch.order_no &&
        !valueSearch.receipt &&
        (valueSearch.dates ? !valueSearch.dates[0] && !valueSearch.dates[1] : true)
      ) {
        message.warning('Please enter an input to search');
        return;
      }

      let bodySearch: OrderSearchParamType = {
        receipt: '',
        start: '',
        end: '',
      };
      bodySearch.order_no = valueSearch.order_no;
      bodySearch.receipt = valueSearch.receipt;
      if (valueSearch.dates) {
        bodySearch.start = valueSearch.dates[0] ? moment(valueSearch.dates[0]).format() : '';
        bodySearch.end = valueSearch.dates[1] ? moment(valueSearch.dates[1]).format() : '';
      }
      props.onSearch(bodySearch);
    } catch (error) {
      console.error(error);
    }
  };

  const onReset = () => {
    try {
      setValueSearch((s) => ({
        ...s,
        order_no: '',
        receipt: '',
        dates: ['', ''],
        start: '',
        end: '',
      }));
      props.onReset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <TableCustom
        loading={props.loading}
        //
        columns={columns}
        data={props.data}
        rowKey='id'
        //
        searchColumn={searchColumn}
        //
        width={800}
        isPagination={props.data && props.data.length > pageSize}
        total={props.data?.length || 0}
        pageSize={pageSize}
        onChangePage={(page) => setPage(page)}
        //
        onSearch={onSearch}
        onReset={onReset}
      />
    </Fragment>
  );
};

export default OrderSearch;
