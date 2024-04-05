import md5 from 'md5';
import { Button, Form, Input, Typography } from 'antd';

import { useAppDispatch } from 'redux/hooks';
import { onChangePassword } from 'redux/action/auth';

import { messageValidatePW } from 'common/constant';

import { DataAdminAccount } from 'models/administrator.model';
import { userType } from 'models/auth.model';

import * as SC from './style';

type Props = {
  data?: userType;
  loadingChangePass?: boolean;
};

const ProfileChangePW = ({ data, loadingChangePass }: Props) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const parm: DataAdminAccount = {
      old_password: md5(values.old_password),
      password: md5(values.password),
      username: data?.username,
      permis: data?.permis || [],
    };

    dispatch(onChangePassword({ id: data?.id, parm, form }));
  };

  return (
    <SC.Profile_ChangePW>
      <Typography.Title level={5} className='pb-2'>
        Change Password
      </Typography.Title>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='old_password'
          label='Current password'
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Please enter your Current Password' },
            { whitespace: true, message: 'Cannot be empty' },
          ]}>
          <Input.Password disabled={loadingChangePass} />
        </Form.Item>

        <Form.Item
          name='password'
          label='New password'
          tooltip={messageValidatePW}
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Please enter your New Password' },
            { whitespace: true, message: 'Cannot be empty' },
            {
              pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
              message: 'Incorrect password format',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('old_password') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The new password must be different from the current password!')
                );
              },
            }),
          ]}>
          <Input.Password disabled={loadingChangePass} />
        </Form.Item>

        <Form.Item
          name='confirm_password'
          label='Confirm password'
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Please confirm Password' },
            { whitespace: true, message: 'Cannot be empty' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}>
          <Input.Password disabled={loadingChangePass} />
        </Form.Item>

        <div className='text-right pt-3'>
          <Button type='primary' htmlType='submit' loading={loadingChangePass}>
            Change
          </Button>
        </div>
      </Form>
    </SC.Profile_ChangePW>
  );
};

export default ProfileChangePW;
