import moment from 'moment';
import { Card, DatePicker, Form } from 'antd';

import { ModelingStatus } from 'models/modeling-landing-page-orders';

import styled from 'styled-components';
import { PageContent } from 'styles/__styles';

type Props = { status: ModelingStatus; time?: string };

export default function ModelingOrderEstimated({ status, time }: Readonly<Props>) {
  return (
    <PageContent>
      <Content size='small' title='Estimated time' bordered={false}>
        <Form.Item
          name='estimated_time'
          rules={[{ required: true, message: 'Please select a completion date for your order' }]}
          initialValue={time ? moment(time, 'YYYY-MM-DD') : undefined}>
          <DatePicker
            format='YYYY-MM-DD'
            className='w-100'
            allowClear={false}
            open={status !== ModelingStatus.QUOTE ? false : undefined}
            inputReadOnly={status !== ModelingStatus.QUOTE}
            disabledDate={(current) => current.isBefore(moment(), 'day')}
          />
        </Form.Item>
      </Content>
    </PageContent>
  );
}

const Content = styled(Card)`
  .ant-card-head,
  .ant-card-body {
    padding: 0;
  }
  .ant-card-body {
    margin-top: 16px;
  }
`;
