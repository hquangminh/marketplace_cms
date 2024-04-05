import { useState } from 'react';
import Link from 'next/link';

import moment from 'moment';
import { Button, Card, CardProps, Descriptions, Drawer, DrawerProps } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';

import { capitalizeFirstLetter, formatNumber } from 'common/functions';

import Icon from 'components/fragments/Icons';
import RenderStatusComponent from '../Fragment/RenderStatus';

import { ModelingOrderModel } from 'models/modeling-landing-page-orders';

import styled from 'styled-components';
import { PageContent } from 'styles/__styles';

type Props = { data: ModelingOrderModel };

export default function ModelingOrderInformation({ data }: Readonly<Props>) {
  const [openLogs, setOpenLogs] = useState<boolean>(false);

  const [_, methodName, methodUse] = (data.payment_method ?? '').split('|');
  const paymentMethod = methodUse?.length === 4 ? '****' + methodUse : methodUse;

  const cardProps: CardProps = {
    size: 'small',
    bordered: false,
    title: 'Order information',
    extra: (
      <Button type='text' icon={<ContainerOutlined />} onClick={() => setOpenLogs(true)}>
        Status log
      </Button>
    ),
  };

  const drawerProps: DrawerProps = {
    open: openLogs,
    title: 'Status log',
    onClose: () => setOpenLogs(false),
  };

  return (
    <PageContent>
      <Content {...cardProps}>
        <Descriptions style={{ marginTop: 20 }}>
          <Descriptions.Item label='Customer'>
            <Link href={'/users/' + data.market_user.id}>{data.market_user.name}</Link>
          </Descriptions.Item>
          <Descriptions.Item label='Order no'>{data.order_no}</Descriptions.Item>
          <Descriptions.Item label='Order name'>{data.name}</Descriptions.Item>
          <Descriptions.Item label='Total amount'>
            {formatNumber(
              data.modeling_products.reduce((sum, product) => sum + product.price, 0) || 0,
              '$'
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Payment gateway'>
            {data.payment_method && data.paygate === 'paypal' && <Icon iconName='paypal' />}
            {data.payment_method && data.paygate === 'stripe' && <Icon iconName='stripe' />}
          </Descriptions.Item>
          <Descriptions.Item label='Payment Method'>
            {data.payment_method
              ? capitalizeFirstLetter(methodName) + ' (' + paymentMethod + ')'
              : null}
            {data.receipt_url && (
              <a href={data.receipt_url} style={{ marginLeft: 10, fontSize: 11 }}>
                (Receipt)
              </a>
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Date of payment'>
            {data.paidAt ? moment(data.paidAt).format('DD/MM/YYYY') : null}
          </Descriptions.Item>
          <Descriptions.Item label='Suggested time'>
            {data.suggested_time ? moment(data.suggested_time).format('DD/MM/YYYY') : null}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            <RenderStatusComponent status={data.status} />
          </Descriptions.Item>
          <Descriptions.Item label='Reason'>{data.reason}</Descriptions.Item>
        </Descriptions>
      </Content>

      <Drawer {...drawerProps}>
        <Descriptions column={1} colon={false}>
          {data.status_log.map(({ time, status }) => (
            <Descriptions.Item key={time} label={moment(time).format('DD/MM/YYYY HH:mm:ss')}>
              <RenderStatusComponent status={status} />
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Drawer>
    </PageContent>
  );
}

const Content = styled(Card)`
  .ant-card-head,
  .ant-card-body {
    padding: 0;
  }
  .ant-descriptions-item-label {
    color: rgba(0, 0, 0, 0.45);
  }
  .ant-descriptions-item-content .my-icon {
    font-size: 20px;
  }
`;
