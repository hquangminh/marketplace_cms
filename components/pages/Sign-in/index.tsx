import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/router';
import md5 from 'md5';

import ErrorCode from 'api/error-code';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';
import { onLogin } from 'redux/action/auth';

import { getCookie, handlerMessage } from 'common/functions';
import { tokenList } from 'common/constant';

import Loading from 'components/fragments/Loading';

import * as L from './style';

const SignIn: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const token = getCookie(tokenList.TOKEN);
  const [loading, setLoading] = useState<boolean>(false);
  const { authVerifier } = useAppSelector(selectAuthState);
  const { loading: loadingLogin } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(false);
    if (token) {
      if (typeof router.query.urlBack === 'string') router.push(router.query.urlBack);
      else router.push('/');
    } else if (router.query.error) {
      const { error, ...query } = router.query;
      router.replace({ query }, undefined, { shallow: true });
      handlerMessage(ErrorCode[router.query.error.toString()], 'error');
    }
    setLoading(true);
  }, [router.query.error]);

  const onFinish = (values: any) => {
    values.password = md5(values.password);
    dispatch(onLogin({ values, router }));
  };

  return (
    <L.wrapperSignIn>
      {!loading && <Loading size='large' fullPage />}

      <div className={`wrapper ${authVerifier ? 'disable__event' : ''}`}>
        <h4 className='title '>Log in to VRStyler</h4>
        <Form
          name='normal_login'
          className='login-form'
          layout='vertical'
          disabled={loadingLogin}
          onFinish={onFinish}
          form={form}>
          <Form.Item
            name='username'
            label='Username'
            rules={[{ required: true, message: 'Please enter Username' }]}>
            <Input className='w-100' />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[{ required: true, message: 'Please enter Password' }]}>
            <Input type='password' className='w-100' />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loadingLogin}
              className='login-form-button w-100 d-flex justify-content-center align-items-center mt-4'>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </L.wrapperSignIn>
  );
};

export default SignIn;
