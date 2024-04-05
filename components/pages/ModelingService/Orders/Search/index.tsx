import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { onCheckErrorApiMessage } from 'common/functions';

import orderServices from 'services/modeling-service/order-services';

import TableFragment from '../TableFragment';

import { ModelingOrderModel, ParamSort } from 'models/modeling-landing-page-orders';

const pageSize = 10;

const SearchComponent = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ total: number; data: ModelingOrderModel[] }>({
    total: 0,
    data: [],
  });

  const search = Form.useWatch('name', form);
  const status = Form.useWatch('status', form);
  const sortBy = Form.useWatch('sort_by', form);
  const sortType = Form.useWatch('sort_type', form);
  const allowSearch = search?.trim() || typeof status === 'number' || status === 'all';

  useEffect(() => {
    if (!sortBy) form.setFieldValue('sort_type', undefined);
    else if (!sortType) form.setFieldValue('sort_type', 'asc');
  }, [sortBy]);

  const onFetchSearchOrder = useCallback(async () => {
    try {
      const { page, ...values } = router.query;
      if (Object.keys(values).length > 0) {
        setLoading(true);
        const offset = (Number(page ?? 1) - 1) * pageSize;
        const params = {
          ...values,
          name: values.name?.toString().trim(),
          status: values.status !== 'all' ? Number(values.status) : undefined,
        };
        await orderServices
          .getAllOrders({ limit: pageSize, offset, params })
          .then(({ data, total }) => setOrder({ data, total }))
          .finally(() => setLoading(false));
      }
    } catch (error: any) {
      if (router.query.page && router.query.page !== '1') onChangePage(1);
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    onFetchSearchOrder();
  }, [onFetchSearchOrder]);

  const onFinish = (values: ParamSort) => {
    const query = Object.fromEntries(Object.entries(values).filter(([_, value]) => value));
    router.push({ query: { ...query, page: '1' } }, undefined, { shallow: true });
  };

  const onResetFilter = () => {
    setOrder({ data: [], total: 0 });
    form.resetFields();
    router.push({ query: { page: '1' } }, undefined, { shallow: true });
  };

  const onChangePage = (page: number) =>
    router.push({ query: { ...router.query, page: page.toString() } }, undefined, {
      shallow: true,
    });

  return (
    <>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          ...router.query,
          status: Number(router.query.status) || 'all',
        }}>
        <Row gutter={[20, 5]} className='mb-3'>
          <Col span={12}>
            <Form.Item name='name' label='Order name/code' required>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='status' label='Status' required>
              <Select className='w-100' allowClear>
                <Select.Option value='all'>All</Select.Option>
                <Select.Option value={2}>Pending quote</Select.Option>
                <Select.Option value={3}>Pending payment</Select.Option>
                <Select.Option value={4}>In progress</Select.Option>
                <Select.Option value={5}>In repair</Select.Option>
                <Select.Option value={6}>Pending my review</Select.Option>
                <Select.Option value={7}>Fulfilled</Select.Option>
                <Select.Option value={8}>Canceled</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='sort_by' label='Sort by'>
              <Select className='w-100' allowClear>
                <Select.Option value='createdAt'>Created date</Select.Option>
                <Select.Option value='suggested_time'>Suggested time</Select.Option>
                <Select.Option value='estimated_time'>Estimated time</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='sort_type' label='Sort type'>
              <Select className='w-100' disabled={!sortBy}>
                <Select.Option value='asc'>Ascending</Select.Option>
                <Select.Option value='desc'>Descending</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24} className='text-right mt-1'>
            <Space>
              <Button onClick={onResetFilter}>Reset</Button>
              <Button type='primary' htmlType='submit' disabled={!allowSearch || loading}>
                Search
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <TableFragment
        loading={loading}
        data={order?.data ?? []}
        total={order?.total ?? 0}
        pageSize={pageSize}
        onChangePage={onChangePage}
        setOrderLists={setOrder}
        onFetchOrder={onFetchSearchOrder}
      />
    </>
  );
};

export default SearchComponent;
