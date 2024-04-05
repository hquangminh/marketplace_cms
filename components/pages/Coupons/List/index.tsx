import { useEffect, useState } from 'react';

import moment from 'moment';
import { Button, Input, message, Tabs, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';

import couponServices from 'services/coupon-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';
import MenuAction from 'components/fragments/MenuAction';
import CouponActionModal from '../Action';

import { CouponAction, CouponProps, CouponType } from 'models/coupon.models';

import * as SC from './style';

const pageSize = 10;

const ListCoupons = (props: CouponProps) => {
  const [tab, setTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<CouponType[] | undefined>(undefined);
  const [action, setAction] = useState<CouponAction>({ type: null, coupon: null });

  useEffect(() => {
    if (props.data) {
      let couponList = [...props.data];

      if (textSearch)
        couponList = [...props.data].filter((i) =>
          `${i.prefix}-${i.code}`.toLowerCase().includes(textSearch.toLowerCase())
        );

      if (tab === 'all')
        setData(
          couponList.filter(
            (i) =>
              i.status &&
              (moment(i.expired, 'YYYY-MM-DD').isAfter(moment.now()) ||
                moment(i.start, 'YYYY-MM-DD').isAfter(moment.now())) &&
              i.amount !== i.used
          )
        );
      else if (tab === 'processing')
        setData(
          couponList.filter(
            (i) =>
              i.status &&
              moment(i.expired, 'YYYY-MM-DD').isAfter(moment.now()) &&
              moment(i.start, 'YYYY-MM-DD').isBefore(moment.now()) &&
              i.amount !== i.used
          )
        );
      else if (tab === 'end')
        setData(
          couponList.filter(
            (i) =>
              moment(i.expired, 'YYYY-MM-DD').isBefore(moment.now()) ||
              i.amount === i.used ||
              !i.status
          )
        );
    } else setData(undefined);
  }, [props.data, tab, textSearch]);

  const columns: ColumnsType<CouponType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Coupon',
      key: 'coupon',
      render: (_, record) => record.prefix + '-' + record.code,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text) => (
        <Tag style={{ minWidth: 80, marginRight: 0 }} color={text === 'percent' ? 'gold' : 'cyan'}>
          {text.slice(0, 1).toUpperCase() + text.slice(1)}
        </Tag>
      ),
      sorter: (a, b) => a.type.length - b.type.length,
      showSorterTooltip: false,
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'center' },
    { title: 'Used', dataIndex: 'used', key: 'used', align: 'center' },
    {
      title: 'Activated',
      dataIndex: 'status',
      key: 'active',
      align: 'center',
      render: (text) => <StatusCheck checked={text} />,
      sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1),
      showSorterTooltip: false,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          disabled={[
            (record.used && record.used > 0) || record.market_orders_aggregate.aggregate.count > 0
              ? 'delete'
              : '',
            (record.used && record.used === record.amount) ||
            moment(record.expired, 'YYYY-MM-DD').isBefore(moment.now())
              ? 'edit'
              : '',
          ]}
          contentDelete={{
            title: 'Are you sure delete this coupon?',
            content: `${record.prefix}-${record.code}`,
          }}
          handleView={
            props.allowAction.read
              ? () => setAction((c) => ({ ...c, type: 'view', coupon: record }))
              : onToastNoPermission
          }
          handleEdit={
            props.allowAction.add
              ? () => setAction((c) => ({ ...c, type: 'edit', coupon: record }))
              : onToastNoPermission
          }
          handleDelete={
            props.allowAction.remove ? () => deleteCoupon(record.id) : onToastNoPermission
          }
        />
      ),
    },
  ];

  const deleteCoupon = async (couponId: string) => {
    try {
      setLoading(true);
      const res = await couponServices.deleteCoupon(couponId);
      if (!res.error) {
        props.updateCouponList('delete', couponId);
        handlerMessage('Delete coupon succedded', 'success');
      } else message.error('Delete coupon failed, please try again later');

      setLoading(false);
      setAction((s) => ({ ...s, type: null, coupon: null }));
    } catch (error: any) {
      setLoading(false);
      setAction((s) => ({ ...s, type: null, coupon: null }));
      onCheckErrorApiMessage(error);
    }
  };

  return (
    <SC.Wrapper id='parent-popup'>
      <Tabs activeKey={tab} onChange={(key: string) => setTab(key)}>
        <Tabs.TabPane tab='ALL COUPONS' key='all' />
        <Tabs.TabPane tab='IS ACTIVE' key='processing' />
        <Tabs.TabPane tab='END' key='end' />
      </Tabs>

      {props.allowAction.add && (
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setAction({ type: 'add', coupon: null })}>
          Create
        </Button>
      )}

      <SC.SearchBox>
        <Input
          bordered={false}
          placeholder='Search coupon'
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
        />
      </SC.SearchBox>

      <SC.CouponList>
        <TableCustom
          loading={props.loading}
          columns={columns}
          data={data}
          rowKey='id'
          isPagination={data && data?.length > pageSize}
          onChangePage={(page) => setPage(page)}
        />
      </SC.CouponList>

      <CouponActionModal
        allowAction={props.allowAction}
        loading={loading}
        type={action.type}
        data={action.coupon}
        onDelete={deleteCoupon}
        updateCouponList={props.updateCouponList}
        onClose={() => setAction({ type: null, coupon: null })}
        onChangeToEdit={() => setAction((s) => ({ ...s, type: 'edit' }))}
      />
    </SC.Wrapper>
  );
};

export default ListCoupons;
