import { useState } from 'react';
import { Button, Form, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import FaqServices from 'services/modeling-service/landing-page/faq-services';

import FaqActionModal from '../Action';
import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';

import { FaqProps, FaqType, ModalLists, ParamsType } from 'models/modeling-landing-page-faq';
import { typeImg } from 'models/category.model';

import { Container } from 'styles/__styles';
import * as L from './style';

const FAQsComponent = (props: FaqProps) => {
  const { setFaq } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<typeImg[] | []>([]);
  const [modalLists, setModalLists] = useState<ModalLists>({
    isShow: false,
    data: null,
    type: '',
  });

  const onFetchEditFaq = async (id: string, body: ParamsType) => {
    setLoading(true);
    try {
      const resp = await FaqServices.updateFaq(id, body);

      if (!resp.error) {
        setFaq(
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

  const onFetchCreateFaq = async (body: ParamsType) => {
    setLoading(true);

    try {
      const resp = await FaqServices.createFaq(body);

      if (!resp.error) {
        resp.status = false;
        setFaq((prevState) => (prevState ? [resp.data, ...prevState] : [resp.data]));
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

  const onFetchDeleteFaq = async (id: string) => {
    try {
      setLoading(true);
      const resp = await FaqServices.deleteFaq(id);
      if (!resp.error) {
        setFaq((prevState) => prevState && prevState.filter((item) => item.id !== id));
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

  const columns: ColumnsType<FaqType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Order Id',
      dataIndex: 'orderid',
      key: 'orderid',
    },
    {
      title: 'Question',
      dataIndex: 'question',
      width: ' 30%',
      key: 'question',
      className: 'text',
    },
    {
      title: 'Answer ',
      dataIndex: 'answer',
      width: ' 40%',
      key: 'answer',
      className: 'text',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value: boolean) => (
        <>
          {value === true && (
            <Tag className='status' color='success' style={{ minWidth: 80, marginRight: 0 }}>
              Active
            </Tag>
          )}
          {value === false && (
            <Tag className='status' color='error' style={{ minWidth: 80, marginRight: 0 }}>
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
      className: 'action_faqs',
      render: (record: any) => (
        <MenuAction
          data={record}
          contentDelete={{ content: `Question: ${record.question}` }}
          handleEdit={() => setModalLists({ isShow: true, data: record, type: 'edit' })}
          handleDelete={() => onFetchDeleteFaq(record.id)}
        />
      ),
    },
  ];

  return (
    <L.Faqs_wrapper>
      <Container>
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setModalLists(() => ({ type: 'create', isShow: true, data: null }))}>
          Create
        </Button>

        <TableCustom data={props.faqs || undefined} columns={columns} rowKey='id' width={800} />
      </Container>

      <FaqActionModal
        modalLists={modalLists}
        loading={loading}
        setModalLists={setModalLists}
        onFetchEditFaq={onFetchEditFaq}
        onFetchCreateFaq={onFetchCreateFaq}
        onFetchDeleteFaq={onFetchDeleteFaq}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
      />
    </L.Faqs_wrapper>
  );
};

export default FAQsComponent;
