import moment from 'moment';

import { useRouter } from 'next/router';

import { Button, Col, Form, Input, Row, Select } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';

import { formatNumber, handlerMessage } from 'common/functions';

import Icon from 'components/fragments/Icons';
import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';
import RenderStatusComponent from '../Fragment/RenderStatus';

import { ParamUploadProduct, ProductModel } from 'models/modeling-landing-page-orders';

import * as L from './style';

type Props = {
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilterType: React.Dispatch<React.SetStateAction<ParamUploadProduct>>;
  setProductLits: React.Dispatch<
    React.SetStateAction<{ total: number; data: ProductModel[] | null }>
  >;
  data: ProductModel[];
  pageSize: number;
  loading: boolean;
};

const SearchProductComponent = (props: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const columns: ColumnsType<ProductModel> = [
    {
      title: 'Order Id',
      dataIndex: 'modeling_order',
      key: 'modeling_order',
      render: (value) => value.order_no,
    },

    {
      title: 'Product name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 180,
      render: (status) => RenderStatusComponent(status),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatNumber(value, '$'),
    },
    {
      title: 'Created day',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (value) =>
        value ? moment(value).format('DD/MM/YYYY') : <Icon iconName='minus-line' color='#cccccc' />,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleView={() =>
            router.push(`/modeling-service/orders/view/${record.order_id}#${record.id}`)
          }
          label={{
            edit: ![6, 7].includes(record.status) ? 'Upload model' : '',
          }}
          handleEdit={
            [2, 4, 5, 6].includes(record.status) && ![6, 7].includes(record.status)
              ? () => router.push(`/modeling-service/orders/edit/${record.order_id}#${record.id}`)
              : undefined
          }
        />
      ),
    },
  ];

  const onFinish = (values: { status: number; order_no: string }) => {
    if (values.status === undefined && !values.order_no) {
      handlerMessage('Please enter order no or status', 'warning');
      return;
    }
    if (values.status >= 0) {
      props.setFilterType((prevState) => ({ ...prevState, status: values.status }));
    } else {
      props.setFilterType((prevState) => {
        const copy = { ...prevState };

        delete copy['status'];

        return copy;
      });
    }

    if (values.order_no) {
      props.setFilterType((prevState) => ({
        ...prevState,
        order_no: values.order_no,
      }));
    } else {
      props.setFilterType((prevState) => {
        const copy = { ...prevState };

        delete copy['order_id'];

        return copy;
      });
    }

    props.setPage(1);
  };

  return (
    <L.ProductComponent_wrapper>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row className='mb-3' gutter={[20, 5]}>
          <Col span={12}>
            <Form.Item
              name='order_no'
              rules={[{ whitespace: true, message: 'Order no cannot be empty' }]}>
              <Input placeholder='Search by Order Id' className='w-100' allowClear />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='status' noStyle>
              <Select className='w-100' placeholder='Select status' allowClear>
                <Select.Option value={4}>In progress</Select.Option>
                <Select.Option value={5}>In repair</Select.Option>
                <Select.Option value={6}>Pending my review</Select.Option>
                <Select.Option value={7}>Fulfilled</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24} className='text-right'>
            <Button
              className='mr-3'
              onClick={() => {
                form.resetFields();
                props.setFilterType({});
                props.setProductLits({
                  total: 0,
                  data: null,
                });
              }}>
              Reset
            </Button>

            <Button type='primary' htmlType='submit'>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <TableCustom
        loading={props.loading}
        columns={columns}
        data={props.data || []}
        page={props.page}
        total={props.total}
        rowKey='id'
        isPagination={props.total ? props.total > (props.pageSize || 0) : false}
        pageSize={props.pageSize}
        onChangePage={(page) => props.setPage(page)}
        width={800}
      />
    </L.ProductComponent_wrapper>
  );
};

export default SearchProductComponent;
