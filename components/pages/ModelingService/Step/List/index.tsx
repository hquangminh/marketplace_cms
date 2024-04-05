import { useState } from 'react';
import { Button, Form, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import stepServices from 'services/modeling-service/landing-page/step-services';

import StepActionModal from '../Action';
import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';

import { ModalLists, ParamsType, StepProps, StepType } from 'models/modeling-landing-page-step';
import { typeImg } from 'models/category.model';

import { Container } from 'styles/__styles';
import * as L from './style';

const StepComponent = (props: StepProps) => {
  const { setStep } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<typeImg[] | []>([]);
  const [modalLists, setModalLists] = useState<ModalLists>({
    isShow: false,
    data: null,
    type: '',
  });

  const onFetchEditStep = async (id: string, body: ParamsType) => {
    setLoading(true);
    try {
      const resp = await stepServices.updateStep(id, body);

      if (!resp.error) {
        setStep(
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

  const onFetchCreateStep = async (body: ParamsType) => {
    setLoading(true);

    try {
      const resp = await stepServices.createStep(body);

      if (!resp.error) {
        resp.status = false;
        setStep((prevState) => (prevState ? [resp.data, ...prevState] : [resp.data]));
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

  const onFetchDeleteStep = async (id: string) => {
    try {
      setLoading(true);
      const resp = await stepServices.deleteStep(id);
      if (!resp.error) {
        setStep((prevState) => prevState && prevState.filter((item) => item.id !== id));
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

  const columns: ColumnsType<StepType> = [
    {
      title: 'Order Id ',
      dataIndex: 'orderid',
      key: 'orderid',
      width: '10%',
    },
    {
      title: 'Title ',
      dataIndex: 'title',
      className: 'title_step',
      key: 'title',
      width: '10%',
    },
    {
      title: 'Description ',
      className: 'description_step',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      className: 'image_step',
      align: 'center',
      render: (url: string, record: StepType) => (
        <div className='step__card'>{record?.image ? <img src={url} alt='' /> : ''}</div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'status_step',
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
      className: 'action_step',
      render: (record: any) => (
        <MenuAction
          data={record}
          contentDelete={{ content: `Title: ${record.title}` }}
          handleEdit={() => setModalLists({ isShow: true, data: record, type: 'edit' })}
          handleDelete={() => onFetchDeleteStep(record.id)}
        />
      ),
    },
  ];

  return (
    <L.Step_wrapper>
      <Container>
        <Button
          className='btn-add'
          type='primary'
          onClick={() => setModalLists(() => ({ type: 'create', isShow: true, data: null }))}>
          Create
        </Button>

        <TableCustom data={props.steps || undefined} columns={columns} rowKey='id' width={800} />
      </Container>

      <StepActionModal
        modalLists={modalLists}
        loading={loading}
        setModalLists={setModalLists}
        onFetchEditStep={onFetchEditStep}
        onFetchCreateStep={onFetchCreateStep}
        onFetchDeleteStep={onFetchDeleteStep}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
      />
    </L.Step_wrapper>
  );
};

export default StepComponent;
