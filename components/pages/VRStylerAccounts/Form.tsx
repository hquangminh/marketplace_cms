import { useEffect, useState } from 'react';

import md5 from 'md5';
import { Form, Input, Modal, ModalProps } from 'antd';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import userServices from 'services/user-services';

import { UserModel } from 'models/user.model';

type Props = {
  open: boolean;
  data?: UserModel;
  onClose: () => void;
  onSuccess: () => void;
  onCancelEdit: () => void;
};

const VRStylerAccountsForm = (props: Props) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (props.data) form.setFieldsValue(props.data);
    else form.resetFields();
  }, [props.data]);

  const onSubmit = (values: any) => {
    if (props.data) onUpdate(values);
    else onCreate(values);
  };

  const onCreate = async (values: any) => {
    setSubmitting(true);
    const params = { ...values, password: md5(values.password), status: true };
    await userServices
      .createUser(params)
      .then(() => {
        handlerMessage('Create success', 'success');
        props.onClose();
        props.onSuccess();
        form.resetFields();
      })
      .catch((error) => onCheckErrorApiMessage(error))
      .finally(() => setSubmitting(false));
  };

  const onUpdate = async (values: any) => {
    setSubmitting(true);
    if (props.data) {
      const params = {
        ...values,
        password: values.password ? md5(values.password) : undefined,
        status: true,
      };
      await userServices
        .edit(props.data.id, params)
        .then(() => {
          handlerMessage('Edit success', 'success');
          props.onClose();
          props.onSuccess();
          form.resetFields();
        })
        .catch((error) => onCheckErrorApiMessage(error))
        .finally(() => setSubmitting(false));
    }
  };

  const onClose = () => {
    if (props.data) props.onCancelEdit();
    else props.onClose();
  };

  const modalProps: ModalProps = {
    title: props.data ? 'Edit Account' : 'Create Account',
    open: props.open,
    centered: true,
    destroyOnClose: true,
    closable: !submitting,
    okText: 'Save',
    okButtonProps: { loading: submitting },
    bodyStyle: { paddingBlock: 10 },
    onCancel: onClose,
    onOk: form.submit,
  };

  return (
    <Modal {...modalProps}>
      <Form form={form} layout='vertical' onFinish={onSubmit} autoComplete='off'>
        <Form.Item
          label='Name'
          name='name'
          rules={[
            { required: true, message: '${label} is required' },
            { whitespace: true, message: '${label} cannot be empty' },
          ]}>
          <Input disabled={submitting} />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { type: 'email', message: 'The input is not valid ${label}!' },
            { required: true, message: 'Please input ${label}!' },
          ]}>
          <Input disabled={submitting} />
        </Form.Item>

        <Form.Item
          label='Username'
          name='nickname'
          rules={[{ required: true, message: '${label} is required' }]}>
          <Input disabled={submitting || typeof props.data !== 'undefined'} />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: !props.data, message: '${label} is required' },
            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
              message: 'Incorrect password format',
            },
          ]}>
          <Input.Password disabled={submitting} autoComplete='new-password' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VRStylerAccountsForm;
