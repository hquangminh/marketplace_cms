import { useEffect } from 'react';
import { Button, Col, Row, Form, Modal, Input, Select, InputNumber } from 'antd';

import { capitalizeFirstLetter } from 'common/functions';

import Loading from 'components/fragments/Loading';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { FaqActionProps, ParamsType } from 'models/modeling-landing-page-faq';

import styled from 'styled-components';

const FaqActionModal = (props: FaqActionProps) => {
  const {
    modalLists,
    setModalLists,
    loading,
    onFetchEditFaq,
    onFetchCreateFaq,
    onFetchDeleteFaq,
    form,
  } = props;

  useEffect(() => {
    if (modalLists.type === 'edit') {
      form.setFieldsValue({
        answer: modalLists.data?.answer,
        question: modalLists.data?.question,
        orderid: modalLists.data?.orderid,
        status: modalLists.data?.status,
      });
    } else {
      form.resetFields();
    }
  }, [modalLists]);

  const onSubmit = (values: ParamsType) => {
    const params: ParamsType = {
      ...values,
    };

    if (modalLists.type === 'edit') {
      onFetchEditFaq(modalLists.data?.id as string, params);
      return;
    }

    onFetchCreateFaq(params);
  };

  const deleteModal = () => {
    showConfirmDelete(
      modalLists.data?.id as string,
      onFetchDeleteFaq,
      'Are you sure delete this item?',
      `Question: ${modalLists.data?.question}`
    );
  };

  return (
    <Modal
      title={modalLists.type ? capitalizeFirstLetter(modalLists.type) + ' faqs' : ''}
      centered
      visible={modalLists.isShow}
      destroyOnClose={true}
      footer={null}
      onCancel={() => setModalLists(() => ({ isShow: false, data: null, type: 'create' }))}>
      {loading && <Loading isOpacity />}
      <Form_wrapper>
        <Form
          layout='vertical'
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item name='status' label='Status'>
                <Select
                  defaultValue={false}
                  className='w-100'
                  style={{ width: 120 }}
                  options={[
                    { value: true, label: 'Active' },
                    { value: false, label: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='orderid'
                label='OrderId'
                rules={[{ required: true, message: 'OrderId is required' }]}>
                <InputNumber
                  type='number'
                  className='sort_number'
                  placeholder='Input number order id'
                  min={0}
                  max={99999}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='question'
                label='Question'
                rules={[
                  { required: true, message: 'Question is required' },
                  { whitespace: true, message: 'Question cannot be empty' },
                ]}>
                <Input.TextArea placeholder='Input question' rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='answer'
                label='Answer'
                rules={[
                  { required: true, message: 'Answer is required' },
                  { whitespace: true, message: 'Answer cannot be empty' },
                ]}>
                <Input.TextArea placeholder='Input answer' rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <hr />
            </Col>
            <Col span={24} className='mt-2 btn-submit'>
              <div>
                {modalLists.type === 'edit' ? (
                  <Button className='ml-3' type='primary' danger onClick={deleteModal}>
                    Delete
                  </Button>
                ) : null}
                {(modalLists.type === 'edit' || modalLists.type === 'create') && (
                  <Button className='ml-3' type='primary' htmlType='submit'>
                    Submit
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Form_wrapper>
    </Modal>
  );
};

const Form_wrapper = styled.div`
  position: relative;
  .sort_number {
    width: 100%;
  }
  .btn-submit {
    text-align: right;
  }
`;

export default FaqActionModal;
