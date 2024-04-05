import Link from 'next/link';
import moment from 'moment';

import { Spin } from 'antd';
import * as AntIcon from '@ant-design/icons';
import { LineOutlined } from '@ant-design/icons';

import { ColumnsType } from 'antd/lib/table';
import config from 'config';

import {
  capitalizeFirstLetter,
  changeToSlug,
  formatNumber,
  onToastNoPermission,
} from 'common/functions';
import { OrderStatus, theme } from 'common/constant';

import TableCustom from 'components/fragments/TableCustom';
import StatusOrder from 'components/fragments/StatusOrder';
import Icon from 'components/fragments/Icons';

import { OrderDetailProps } from 'models/order.model';
import { ProductModel } from 'models/product.model';

import * as SC from './style';

const OrderDetail = (props: OrderDetailProps) => {
  const { data } = props;

  const columns: ColumnsType<ProductModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a
          className='product-name'
          href={`${config.urlWeb}/product/${changeToSlug(text)}--${record.id}`}
          onClick={(event) => {
            event.preventDefault();
            const url = `${config.urlWeb}/product/${changeToSlug(text)}--${record.id}`;
            const tab = window.open(url, '_blank');
            if (tab) {
              tab.focus(); // Bring the newly opened tab to the front
            }
          }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (_, record) => (
        <div className='price__row'>
          {record.old_price ? (
            <span className='old__price'>{formatNumber(record.old_price || 0, '$')}</span>
          ) : (
            ''
          )}
          <p>{formatNumber(record.price, '$')}</p>
        </div>
      ),
    },
  ];

  const getSubtotal = () => {
    let result = 0;
    data?.items?.forEach((i: any) => (result += i.price));
    return result;
  };

  return (
    <Spin spinning={props.loading}>
      <SC.Wrapper>
        <SC.CustomerInfo>
          <h4>Customer Infomation</h4>

          <div className='list'>
            <SC.InfoItem>
              <AntIcon.UserOutlined className='my-icon' />
              <p className='title'>Customer</p>
              {data?.market_user && (
                <p className='value'>
                  {props.allowAction?.read ? (
                    <Link
                      style={{ color: theme.primary_color, cursor: 'pointer' }}
                      href={'/users/' + data.market_user.id}>
                      {data.market_user.name}
                    </Link>
                  ) : (
                    <p
                      style={{ color: theme.primary_color, cursor: 'pointer' }}
                      onClick={onToastNoPermission}>
                      {data.market_user.name}
                    </p>
                  )}
                </p>
              )}
            </SC.InfoItem>

            <SC.InfoItem>
              <AntIcon.MailOutlined className='my-icon' />
              <p className='title'>Email</p>
              {data?.market_user && <p className='value'>{data.market_user.email}</p>}
            </SC.InfoItem>
          </div>
        </SC.CustomerInfo>
        <SC.OrderInfo>
          <h4>Order Infomation</h4>

          <div className='list'>
            <SC.InfoItem>
              <Icon iconName='order-no' />
              <p className='title'>Order no</p>
              {data?.order_no && <p className='value'>#{data.order_no}</p>}
            </SC.InfoItem>

            <SC.InfoItem>
              <AntIcon.ClockCircleOutlined className='my-icon' />
              <p className='title'>Time Order</p>
              <p className='value'>
                {data?.createdAt
                  ? moment(data.createdAt).format('DD/MM/YYYY h:mm:ss A').toLocaleString()
                  : ''}
              </p>
            </SC.InfoItem>

            {data?.paidAt && (
              <SC.InfoItem>
                <AntIcon.ClockCircleOutlined className='my-icon' />
                <p className='title'>Time Payment</p>
                <p className='value'>
                  {data?.paidAt
                    ? moment(data.paidAt).format('DD/MM/YYYY h:mm:ss A').toLocaleString()
                    : ''}
                </p>
              </SC.InfoItem>
            )}

            {data?.status && OrderStatus[data?.status] === 'Cancelled' && (
              <SC.InfoItem>
                <AntIcon.ClockCircleOutlined className='my-icon' />
                <p className='title'>Cancellation Time</p>
                <p className='value'>
                  {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : ''}
                </p>
              </SC.InfoItem>
            )}

            <SC.InfoItem>
              <Icon iconName='info-circle-outline' />
              <p className='title'>Status</p>
              <p className='value'>
                <StatusOrder status={data?.status || 0} type='tag' />
              </p>
            </SC.InfoItem>

            {data?.payment_method && (
              <SC.InfoItem>
                <Icon iconName='card-credit' />
                <p className='title'>Payment Method</p>
                <p className='value'>{`${capitalizeFirstLetter(
                  data?.payment_method?.split('|')[1]
                )} (****${data?.payment_method?.split('|')[2]})`}</p>
              </SC.InfoItem>
            )}

            <SC.InfoItem>
              <Icon iconName='coins-outline' />
              <p className='title'>Payment Amount</p>
              {data?.amount && data?.status === 1 ? (
                <p className='value'>{formatNumber(data.amount, '$')}</p>
              ) : null}
            </SC.InfoItem>

            {data?.status && OrderStatus[data?.status] !== 'Cancelled' && (
              <SC.InfoItem>
                <Icon iconName='receipt-outline' />
                <p className='title'>Receipt</p>
                <p className='value'>
                  {data?.receipt_url ? (
                    <a href={data?.receipt_url} target='__blank'>
                      {data?.receipt_id}
                    </a>
                  ) : (
                    <LineOutlined />
                  )}
                </p>
              </SC.InfoItem>
            )}

            {data?.status && OrderStatus[data?.status] !== 'Cancelled' && (
              <SC.InfoItem>
                <Icon iconName='receipt-outline' />
                <p className='title'>Coupon</p>
                <p className='value'>
                  {data?.market_coupon
                    ? data?.market_coupon?.prefix + '-' + data?.market_coupon?.code
                    : ''}
                </p>
              </SC.InfoItem>
            )}
          </div>
        </SC.OrderInfo>
        <SC.ProductTable>
          <TableCustom columns={columns} data={data?.items} rowKey='id' loading={props.loading} />
          {data?.items && data.items.length > 0 && (
            <SC.TotalWrapper>
              <div className='total__date'>
                {props.data?.status === 6 && (
                  <>
                    <p>
                      <span>Order canceled date</span>{' '}
                      {moment(props.data?.updatedAt).format('MMMM DD, YYYY - HH:mm:ss')}
                    </p>
                    <p>
                      <span>Reason cancel:</span> {props.data?.payment_note}
                    </p>
                  </>
                )}
              </div>
              <div className='total__price'>
                <SC.PriceItem>
                  <p>Subtotal</p>
                  <p>{formatNumber(getSubtotal(), '$')}</p>
                </SC.PriceItem>
                <SC.PriceItem>
                  <p>Discount</p>
                  <p className='discount'>
                    {getSubtotal() - data?.amount > 0
                      ? `- ${formatNumber(getSubtotal() - (data?.amount ? data.amount : 0), '$')}`
                      : formatNumber(getSubtotal() - (data?.amount ? data.amount : 0), '$')}
                  </p>
                </SC.PriceItem>
                <SC.PriceItem className='payment__method'>
                  <p>Payment method</p>
                  <p>
                    {props.data?.payment_method ? (
                      props.data?.payment_method?.split('|')[1] === 'visa' ? (
                        <>
                          {props.data?.payment_method?.split('|')[1] === 'visa' && (
                            <Icon iconName='visa' />
                          )}
                          {props.data?.payment_method?.split('|')[0] === 'card' &&
                            ' ****' + props.data?.payment_method?.split('|')[2]}
                        </>
                      ) : (
                        <span className='title__icon-wrapper'>
                          <Icon iconName='paypal' />
                          Paypal
                        </span>
                      )
                    ) : (
                      '-'
                    )}
                  </p>
                </SC.PriceItem>
                <SC.PriceItem>
                  <p>Total</p>
                  <p className='total'>{formatNumber(data?.amount ? data.amount : 0, '$')}</p>
                </SC.PriceItem>
              </div>
            </SC.TotalWrapper>
          )}
        </SC.ProductTable>
      </SC.Wrapper>
    </Spin>
  );
};

export default OrderDetail;
