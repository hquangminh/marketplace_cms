import { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';

import { ColumnsType } from 'antd/lib/table';
import { Button, Form, Input, Modal } from 'antd';

import orderServices from 'services/modeling-service/order-services';
import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import Icon from 'components/fragments/Icons';
import MenuAction from 'components/fragments/MenuAction';
import TableCustom from 'components/fragments/TableCustom';
import RenderStatusComponent from './Fragment/RenderStatus';

import { ModelingOrderModel } from 'models/modeling-landing-page-orders';

type Props = {
  total: number;
  data: ModelingOrderModel[];
  pageSize: number;
  loading: boolean;
  onFetchOrder?: () => void;
  onChangePage: (page: number) => void;
  setOrderLists?: React.Dispatch<
    React.SetStateAction<{ total: number; data: ModelingOrderModel[] }>
  >;
};

const TableFragment = (props: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [modalLists, setModalLists] = useState({
    isShow: false,
    id: '',
  });

  const [loadingCancel, setLoadingCancel] = useState(false);

  const columns: ColumnsType<ModelingOrderModel> = [
    {
      title: 'Number Id',
      dataIndex: 'order_no',
      key: 'order_no',
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
      title: 'Order name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Suggested time',
      dataIndex: 'suggested_time',
      key: 'suggested_time',
      render: (value) =>
        value ? moment(value).format('DD/MM/YYYY') : <Icon iconName='minus-line' color='#cccccc' />,
    },
    {
      title: 'Estimated time',
      dataIndex: 'estimated_time',
      key: 'estimated_time',
      render: (value) =>
        value ? moment(value).format('DD/MM/YYYY') : <Icon iconName='minus-line' color='#cccccc' />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (status) => <RenderStatusComponent status={status} />,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleEdit={() => router.push(`/modeling-service/orders/${record.id}`)}
          handleCancel={
            [2].includes(record.status)
              ? () => setModalLists({ isShow: true, id: record.id })
              : undefined
          }
        />
      ),
    },
  ];

  const onFetchCancelOrder = async (id: string, reason: string) => {
    setLoadingCancel(true);
    try {
      const resp = await orderServices.cancelOrder(id, reason);

      if (!resp.error) {
        if (props.setOrderLists) {
          if (props.onFetchOrder) {
            props.onFetchOrder();
          }

          setModalLists({ isShow: false, id: '' });
        }
        setLoadingCancel(false);

        handlerMessage('Cancel order success', 'success');
      }
    } catch (error: any) {
      setLoadingCancel(false);
      onCheckErrorApiMessage(error);
    }
  };

  return (
    <>
      <TableCustom
        loading={props.loading}
        columns={columns}
        data={props.data || []}
        total={props.total}
        rowKey='id'
        isPagination={props.total ? props.total > (props.pageSize || 0) : false}
        pageSize={props.pageSize}
        onChangePage={(page) => props.onChangePage(page)}
        width={800}
      />

      {props.data.some((d) => [2].includes(d.status)) && (
        <Modal
          title='Reason cancel order'
          destroyOnClose
          footer=''
          onCancel={() =>
            setModalLists((prev) => ({
              ...prev,
              isShow: false,
            }))
          }
          open={modalLists.isShow}
          afterClose={() => form.resetFields()}>
          <Form form={form} onFinish={(values) => onFetchCancelOrder(modalLists.id, values.reason)}>
            <Form.Item
              name='reason'
              rules={[
                {
                  required: true,
                  message: 'Reason is required',
                },
                {
                  whitespace: true,
                  message: 'Reason cannot be blank',
                },
              ]}>
              <Input className='w-100' placeholder='Enter reason' />
            </Form.Item>

            <div className='text-right'>
              <Button type='primary' htmlType='submit' loading={loadingCancel}>
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default TableFragment;
