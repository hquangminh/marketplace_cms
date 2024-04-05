import { useState } from 'react';
import { Button, Form, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import customerServices from 'services/modeling-service/landing-page/customer-services';

import CustomerActionModal from '../Action';
import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';

import { CustomerProps, CustomerType, ModalLists, ParamsType } from 'models/customer.model';
import { typeImg } from 'models/category.model';

import { Container } from 'styles/__styles';
import * as L from './style';

const CustomerListComponent = (props: CustomerProps) => {
  const { setCustomer } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<typeImg[] | []>([]);
  const [modalLists, setModalLists] = useState<ModalLists>({
    isShow: false,
    data: null,
    type: '',
  });

  const onFetchEditCustomer = async (id: string, body: ParamsType) => {
    setLoading(true);
    try {
      const resp = await customerServices.updateCustomer(id, body);

      if (!resp.error) {
        setCustomer(
          (prevState) => prevState && prevState.map((item) => (item.id === id ? resp.data : item))
        );
        setModalLists(() => ({ type: 'create', data: null, isShow: false }));

        setLoading(false);
        setFileList([]);

        form.resetFields();

        handlerMessage('Update success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onFetchCreateCustomer = async (body: ParamsType) => {
    setLoading(true);

    try {
      const resp = await customerServices.createCustomer(body);

      if (!resp.error) {
        resp.status = false;
        setCustomer((prevState) => (prevState ? [resp.data, ...prevState] : [resp.data]));
        setModalLists(() => ({ type: 'create', data: null, isShow: false }));

        setLoading(false);
        setFileList([]);
        form.resetFields();

        handlerMessage('Create success', 'success');
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchDeleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      const resp = await customerServices.deleteCustomer(id);
      if (!resp.error) {
        setCustomer((prevState) => prevState && prevState.filter((item) => item.id !== id));
      }
      setLoading(false);
      setModalLists(() => ({ isShow: false, data: null, type: 'edit' }));
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      setLoading(false);
      setModalLists(() => ({ isShow: false, data: null, type: 'edit' }));

      onCheckErrorApiMessage(error);
    }
  };

  const columns: ColumnsType<CustomerType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Order Id ',
      dataIndex: 'orderid',
      key: 'orderid',
      width: '100px',
    },
    {
      title: 'Title ',
      dataIndex: 'title',
      className: 'title_customer',
      key: 'title',
      width: '100px',
    },
    {
      title: 'Description ',
      className: 'description_customer',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      className: 'image_customer',
      align: 'center',
      render: (url: string, record: CustomerType) => (
        <div className='customer__card'>{record?.image ? <img src={url} alt='' /> : ''}</div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'status_customer',
      render: (value: boolean) => (
        <>
          {value === true && (
            <Tag
              className='status status-1'
              color='success'
              style={{ minWidth: 80, marginRight: 0 }}>
              Active
            </Tag>
          )}
          {value === false && (
            <Tag className='status status-2' color='error' style={{ minWidth: 80, marginRight: 0 }}>
              Inactive
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      className: 'action_customer',
      render: (record: any) => (
        <MenuAction
          data={record}
          handleEdit={() => setModalLists({ isShow: true, data: record, type: 'edit' })}
          handleDelete={() => onFetchDeleteCustomer(record.id)}
        />
      ),
    },
  ];

  return (
    <L.Customer_wrapper>
      <Container>
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setModalLists(() => ({ type: 'create', isShow: true, data: null }))}>
          Create
        </Button>

        <TableCustom
          data={props.customers || undefined}
          columns={columns}
          rowKey='id'
          width={800}
        />
      </Container>

      <CustomerActionModal
        modalLists={modalLists}
        loading={loading}
        setModalLists={setModalLists}
        onFetchEditCustomer={onFetchEditCustomer}
        onFetchCreateCustomer={onFetchCreateCustomer}
        onFetchDeleteCustomer={onFetchDeleteCustomer}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
      />
    </L.Customer_wrapper>
  );
};

export default CustomerListComponent;
