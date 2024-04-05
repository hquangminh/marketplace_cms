import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Input, message, Select } from 'antd';

import { onCheckErrorApiMessage } from 'common/functions';
import withdrawServices from 'services/withdraw-services';

import Loading from 'components/fragments/Loading';

import { UpdateWithdraw, WithDrawActionProps } from 'models/withdraw.model';
import { typeImg } from 'models/category.model';

import styled from 'styled-components';

const ModalUpdate = (props: WithDrawActionProps) => {
  const { withdraw } = props;

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<typeImg[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | undefined>(withdraw?.status);

  useEffect(() => {
    if (withdraw && Object.keys(withdraw).length > 0) {
      setStatus(withdraw.status);
      setFileList([
        {
          uid: '',
          name: withdraw?.image?.split('/')[withdraw?.image?.split('/').length - 1],
          image: withdraw?.image || '',
        },
      ]);
      form.setFieldsValue({
        status: withdraw.status,
        reason: withdraw.reason,
        image: withdraw.image ? withdraw.image : undefined,
      });
    }
  }, [withdraw]);

  const onFieldsChange = (changedFields: any) => {
    if (
      changedFields &&
      changedFields.length === 1 &&
      changedFields[0].name.includes('status') &&
      changedFields[0].value === 1
    ) {
      form.setFieldsValue({
        image: undefined,
        reason: undefined,
        transaction_id: undefined,
      });
    }
  };

  const onSubmit = async (values: UpdateWithdraw) => {
    try {
      setLoading(true);
      let body: UpdateWithdraw = { ...values };
      body.status = values.status;
      body.reason = values.reason;
      body.transaction_id = values.transaction_id ? values.transaction_id : undefined;

      if (values.image?.startsWith('data:image')) {
        body.oldImage = withdraw?.image;
        body.filename = fileList[0].filename || '';
        body.filetype = fileList[0].filetype || '';
      } else {
        body.oldImage = withdraw?.image || undefined;
      }

      const res = await withdrawServices.updateWithDraw(withdraw?.id || '', body);

      if (!res.error) {
        await props.onUpdate(res.data.id, res.data);
        message.success('withdraw succeeded');
      } else {
        message.error('update failed');
      }
      setLoading(false);
      props.onClose();
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const handelClose = () => {
    if (loading === true) {
      props.isShowModal === true;
    } else {
      props.onClose();
      form.resetFields();
    }
  };

  return (
    <Modal
      title='Edit WithDraw'
      centered
      footer={null}
      destroyOnClose
      visible={props.isShowModal}
      onCancel={handelClose}
      maskClosable={true}
      afterClose={() => form.resetFields()}>
      <Form_wrapper>
        {(props.loading || loading) && <Loading isOpacity />}
        <Form layout='vertical' form={form} onFinish={onSubmit} onFieldsChange={onFieldsChange}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                name='status'
                label='Status'
                initialValue={withdraw?.status}
                rules={[{ required: status === 3, message: 'Please upload image!' }]}>
                <Select
                  className='w-100'
                  style={{ width: 120 }}
                  options={[
                    { value: 1, label: 'Success' },
                    { value: 2, label: 'Unsuccessful' },
                    { value: 3, label: 'Wait for confirmation', disabled: true },
                  ]}
                  onChange={(value) => setStatus(value)}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='reason'
                label='Reason'
                initialValue={withdraw?.reason}
                rules={[{ required: status === 2, message: 'Please input reason!' }]}>
                <Input
                  className='w-100'
                  placeholder='Input reason'
                  disabled={status === 3 || status === 1}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='transaction_id'
                label='Transaction Id'
                initialValue={withdraw?.transaction_id}
                rules={[{ required: status === 1, message: 'Please input transaction id!' }]}>
                <Input
                  className='w-100'
                  placeholder='Input transaction id'
                  disabled={status === 3 || status === 2}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='group-btn-action-form'>
              <div className='text-right'>
                <Button className='ml-3' type='primary' htmlType='submit' disabled={status === 3}>
                  Submit
                </Button>
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
`;

export default ModalUpdate;
