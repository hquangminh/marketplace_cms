import { useState } from 'react';
import moment from 'moment';
import Link from 'next/link';

import { Avatar, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { theme } from 'common/constant';
import { formatNumber, onToastNoPermission } from 'common/functions';

import { UserDetailType, UserOrderType } from 'models/user.model';

import TableCustom from 'components/fragments/TableCustom';
import StatusOrder from 'components/fragments/StatusOrder';
import MyImage from 'components/fragments/Image';

import { Text_Truncate } from 'styles/__styles';
import * as SC from './style';

const pageSize = 10;

const UserDetail = (props: UserDetailType) => {
  const [page, setPage] = useState<number>(1);

  const isCheckShowIconSort = (props.user?.market_orders || []).length > 1;

  const columns: ColumnsType<UserOrderType> = [
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
        props.allowAction.read ? (
          <Link href={'/orders/' + record.id}>
            <a style={{ color: theme.primary_color }}>#{text}</a>
          </Link>
        ) : (
          <p
            onClick={onToastNoPermission}
            style={{ color: theme.primary_color, cursor: 'pointer' }}>
            #{text}
          </p>
        ),
    },
    {
      title: 'Date of payment',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (date, record) => {
        if (date) {
          return moment(date).format('DD-MM-YYYY');
        } else if (record.createdAt) {
          return moment(record.createdAt).format('DD-MM-YYYY');
        } else {
          return '';
        }
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text) => formatNumber(text, '$'),
      sorter: isCheckShowIconSort ? (a, b) => a.amount - b.amount : undefined,
    },
    { title: 'Payment method', dataIndex: 'paygate', key: 'paygate', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text) => <StatusOrder status={text} />,
    },
  ];

  return (
    <SC.Wrapper>
      <SC.UserInfo>
        <div className='left'>
          <Avatar
            src={
              <MyImage src={props.user?.image || ''} imgErr='/static/images/avatar-default.png' />
            }
          />
        </div>
        <div className='right'>
          <div className='info-group'>
            <h4 className='info-group_name'>Personal Infomation</h4>

            <div className='info-group_content'>
              <div className='info-group_content-item'>
                <span>Full Name: </span>
                <p className='text-truncate'>{props.user?.name}</p>
              </div>
              <div className='info-group_content-item'>
                <span>Username: </span>
                <Tag className='w-fitcontent' color='magenta'>
                  {props.user?.nickname}
                </Tag>
              </div>

              <div className='info-group_content-item'>
                <span>Email: </span>
                <p>{props.user?.email}</p>
              </div>
              <div className='info-group_content-item'>
                <span>Register type: </span>
                <p>{props.user?.regtype}</p>
              </div>

              <div className='info-group_content-item'>
                <span>Work: </span>
                <Tag color='cyan'>
                  <Text_Truncate>{props.user?.work}</Text_Truncate>
                </Tag>
              </div>

              <div className='info-group_content-item'>
                <span>Address: </span>
                <p>{props.user?.location}</p>
              </div>
            </div>
          </div>
          <div className='info-group'>
            <h4 className='info-group_name'>Orders</h4>

            <div className='info-group_content'>
              <div className='info-group_content-item'>
                <span>Total orders: </span>
                <p>{props.user?.market_orders.length}</p>
              </div>
              <div className='info-group_content-item'>
                <span>Total amount paid: </span>
                <p>
                  {formatNumber(
                    props.user?.market_orders.reduce(
                      (total, item) => total + (item.status === 1 ? item.amount : 0),
                      0
                    ) || 0,
                    '$'
                  )}
                </p>
              </div>
              <div className='info-group_content-item'>
                <span>Total discount amount: </span>
                <p>
                  {formatNumber(
                    props.user?.market_orders.reduce(
                      (total, item) => total + (item.status === 1 ? item.discount : 0),
                      0
                    ) || 0,
                    '$'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SC.UserInfo>

      <SC.TableOrder>
        <TableCustom
          loading={props.loading}
          columns={columns}
          data={props.user?.market_orders}
          rowKey='id'
          isPagination
          pageSize={pageSize}
          onChangePage={(page) => setPage(page)}
        />
      </SC.TableOrder>
    </SC.Wrapper>
  );
};

export default UserDetail;
