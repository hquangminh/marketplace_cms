import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';

import md5 from 'md5';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
// prettier-ignore
import { Button, Checkbox, Col, Form, Input, Row, Select, Typography, Upload } from 'antd';

// prettier-ignore
import { checkIsAdmin, fromEventNormFile, handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import {
  groupRoleConstant,
  listPermission,
  messageValidatePW,
  optionsPermission,
  validationUploadFile,
} from 'common/constant';
import administratorServices from 'services/administrator-services';

import Loading from 'components/fragments/Loading';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { typeImg } from 'models/category.model';
import { PropsAddComponent, DataAdminAccount, AdministratorType } from 'models/administrator.model';

import * as L from './style';

const roleAdmin = {
  category: { list: true, read: true, write: true, remove: true },
  products: { list: true, read: true, write: true, remove: true },
  users: { list: true, read: true, write: true, remove: true },
  orders: { list: true, read: true, write: true, remove: true },
  coupons: { list: true, read: true, write: true, remove: true },
  reports: { list: true, read: true, write: true, remove: true },
  media: { list: true, read: true, write: true, remove: true },
  accounts: { list: true, read: true, write: true, remove: true },
  seo: { list: true, read: true, write: true, remove: true },
  blog: { list: true, read: true, write: true, remove: true },
  help: { list: true, read: true, write: true, remove: true },
  banner: { list: true, read: true, write: true, remove: true },
  license: { list: true, read: true, write: true, remove: true },
  withdraw: { list: true, read: true, write: true, remove: true },
  notification: { list: true, read: true, write: true, remove: true },
  showroom: { list: true, read: true, write: true, remove: true },
};

const AccountsAddComponent = (
  props: PropsAddComponent & { loadingGetDetail?: boolean; users?: AdministratorType[] }
) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const { accountId, loadingGetDetail, accountDetail, users } = props;
  const { me }: any = useAppSelector(selectAuthState);
  const disableEdit = checkIsAdmin(accountDetail?.permis) && me.id === accountId;

  const [loading, setLoading] = useState<boolean>(false);

  const [fileList, setFileList] = useState<typeImg[]>([]);
  const [group, setGroup] = useState<string | null>(null);
  const [roles, setRoles] = useState<any>({});

  const onChangeRole = (type: string, role: string, checked: boolean) => {
    let roleClone: any = { ...roles };

    if (!roleClone[type])
      roleClone[type] = { list: false, read: false, write: false, remove: false };

    roleClone[type][role] = checked;

    setRoles(roleClone);
  };

  const fetchCreateAccount = async (parm: DataAdminAccount) => {
    setLoading(true);
    try {
      await administratorServices.createAccount(parm);
      handlerMessage('Create success', 'success');
      router.push('/accounts');
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const fetchUpdateAccount = async (id: string, parm: DataAdminAccount) => {
    setLoading(true);
    try {
      await administratorServices.updateAccount(id, parm);
      setLoading(false);
      handlerMessage('Update success', 'success');
      router.push('/accounts');
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchDeleteAccount = async (id: string) => {
    try {
      await administratorServices.deleteAccount(id);
      handlerMessage('Delete success', 'success');
      router.push('/accounts');
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onDeleteAccount = () => {
    if (accountId) onFetchDeleteAccount(accountId);
  };

  const onFetchCheckAccount = async (parmCheck: any, parmCreate: any) => {
    setLoading(true);
    try {
      const res = await administratorServices.checkAccount(parmCheck);
      if (!res.error) fetchCreateAccount(parmCreate);
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFinish = ({ image: avatar, ...values }: any) => {
    const param: DataAdminAccount = { ...values };
    if (fileList && fileList.length > 0) {
      const { image, filename, filetype } = fileList[0];
      if (avatar) {
        param['image'] = image;
        param['filename'] = filename;
        param['filetype'] = filetype;
      }
    } else {
      param['image'] = null;
    }

    if (values.password) param.password = md5(values.password);
    else delete param['password'];

    delete param['confirm_password'];

    if (values.group === 'admin') param.permis = roleAdmin;
    else param.permis = roles;

    delete param['account_type'];
    delete param['role'];

    if (form.getFieldValue('isUpdate') && accountId) {
      fetchUpdateAccount(accountId, param);
      return;
    }

    const parmCheck = { username: values.username, email: values.email };
    onFetchCheckAccount(parmCheck, param);
  };

  // Date Upload
  useEffect(() => {
    if (accountDetail?.permis) {
      if (accountDetail.image)
        setFileList([{ uid: '', name: '', image: accountDetail?.image || '' }]);

      form.setFieldsValue({
        name: accountDetail.name,
        email: accountDetail.email,
        username: accountDetail.username,
        permis: accountDetail.permis,
        status: accountDetail.status,
        group: accountDetail.group,
        isUpdate: true,
        account_type: checkIsAdmin(accountDetail.permis) ? 'admin' : 'other',
      });

      setRoles(accountDetail.permis);
      if (accountDetail.group) setGroup(accountDetail.group);
    }
  }, [accountDetail]);

  const onChangeRoleByGroup = (group: string) => {
    setGroup(group);
    const defaultRole: any = {
      category: { list: true, read: true, write: false, remove: false },
      products: { list: true, read: true, write: false, remove: false },
      users: { list: false, read: false, write: false, remove: false },
      orders: { list: false, read: false, write: false, remove: false },
      coupons: { list: false, read: false, write: false, remove: false },
      reports: { list: false, read: false, write: false, remove: false },
      media: { list: true, read: true, write: true, remove: true },
      accounts: { list: false, read: false, write: false, remove: false },
      seo: { list: false, read: false, write: false, remove: false },
      blog: { list: false, read: false, write: false, remove: false },
      help: { list: false, read: false, write: false, remove: false },
      banner: { list: false, read: false, write: false, remove: false },
      license: { list: false, read: false, write: false, remove: false },
      withdraw: { list: false, read: false, write: false, remove: false },
      notification: { list: false, read: false, write: false, remove: false },
      showroom: { list: false, read: false, write: false, remove: false },
    };

    switch (group) {
      case groupRoleConstant.product:
        setRoles({
          ...defaultRole,
          products: { list: true, read: true, write: true, remove: true },
          category: { list: true, read: true, write: true, remove: false },
          orders: { list: true, read: true, write: false, remove: false },
        });

        break;

      case groupRoleConstant.user:
        setRoles({
          ...defaultRole,
          users: { list: true, read: true, write: true, remove: true },
          orders: { list: false, read: true, write: false, remove: false },
        });

        break;

      case groupRoleConstant.order:
        setRoles({
          ...defaultRole,
          users: { list: false, read: true, write: false, remove: false },
          orders: { list: true, read: true, write: true, remove: true },
        });

        break;

      case groupRoleConstant.custom:
        setRoles({ ...defaultRole });
        break;

      default:
        break;
    }
  };

  const onRemoveFile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    form.setFieldsValue({ image: undefined });
    setFileList([]);
  };

  return (
    <L.styleInput>
      {loadingGetDetail && <Loading isOpacity />}
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name='image'
              label='Avatar'
              getValueFromEvent={(e) =>
                fromEventNormFile({
                  file: e.target.files[0],
                  name: 'image',
                  form,
                  type: validationUploadFile.image,
                  msgError: 'Image must be JPG, WEBP, PNG, JPEG and less than 2MB',
                  setFileList,
                  isUpdate: form.getFieldValue('isUpdate'),
                })
              }>
              <span id='image'>
                <Upload
                  className='ant-upload_my-custom'
                  listType='picture-card'
                  showUploadList={false}
                  disabled={loading}
                  maxCount={1}
                  accept={validationUploadFile.image.toString()}>
                  {fileList[0]?.image ? (
                    <div className='image_wrapper position-relative'>
                      <img
                        src={fileList[0]?.image}
                        alt={fileList[0]?.image}
                        className='w-100 h-100'
                      />
                      <button className='btn-delete' onClick={onRemoveFile}>
                        <DeleteOutlined />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined /> <div>Upload</div>
                    </div>
                  )}
                </Upload>
              </span>
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item name='name' label='Name' rules={[{ type: 'string' }]}>
              <Input disabled={loading} />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item
              name='email'
              label='E-mail'
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input E-mail!' },
                () => ({
                  validator(_, value) {
                    if (users && users.findIndex((user) => user.email === value) !== -1) {
                      return Promise.reject(new Error('Email is already exist!'));
                    } else return Promise.resolve();
                  },
                }),
              ]}>
              <Input disabled={loading} />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item
              name='username'
              label='Username'
              rules={[
                { required: true, message: 'Please input Username!' },
                () => ({
                  validator(_, value) {
                    if (users && users.findIndex((user: any) => user.username === value) !== -1)
                      return Promise.reject(new Error('Username is already exist!'));
                    else return Promise.resolve();
                  },
                }),
              ]}>
              <Input disabled={loading} autoComplete='new-username' />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item
              name='password'
              label='Password'
              tooltip={messageValidatePW}
              rules={[
                { required: !accountId, message: 'Password is required' },
                {
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/,
                  message: 'Incorrect password format',
                },
              ]}>
              <Input.Password disabled={loading} autoComplete='new-password' />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item
              name='confirm_password'
              label='Confirm Password'
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value && getFieldValue('password'))
                      return Promise.reject(new Error('Please confirm Password!'));
                    else if (value && getFieldValue('password') !== value)
                      return Promise.reject(
                        new Error('The two passwords that you entered do not match!')
                      );
                    else return Promise.resolve();
                  },
                }),
              ]}>
              <Input.Password disabled={loading} />
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item name='status' label='Status' initialValue={true}>
              <Select placeholder='Select Status' disabled={loading || disableEdit}>
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xl={8}>
            <Form.Item
              name='group'
              label='Group'
              initialValue={group}
              rules={[{ required: true, message: 'Please select Group!' }]}>
              <Select
                placeholder='Select Group'
                disabled={loading || disableEdit}
                onChange={(value) => onChangeRoleByGroup(value)}>
                <Select.Option value='admin'>Admin</Select.Option>
                <Select.Option value='product'>Product</Select.Option>
                <Select.Option value='user'>User</Select.Option>
                <Select.Option value='order'>Order</Select.Option>
                <Select.Option value='custom'>Custom</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {group !== null && group !== groupRoleConstant.admin && (
            <Col span={24} className='pt-3'>
              <Form.Item name='role'>
                <>
                  {listPermission.map((i) => {
                    return (
                      <div key={i} className='mb-2'>
                        <Typography.Text className='d-inline-block' style={{ width: '120px' }}>
                          {i}
                        </Typography.Text>
                        {optionsPermission.map((o) => {
                          return (
                            <Checkbox
                              key={o.value}
                              className={`${
                                group !== groupRoleConstant.admin &&
                                group !== groupRoleConstant.custom
                                  ? 'check__role--not-allow'
                                  : ''
                              }`}
                              checked={
                                roles[i.toLowerCase()] ? roles[i.toLowerCase()][o.value] : false
                              }
                              onChange={(e) =>
                                onChangeRole(i.toLowerCase(), o.value, e.target.checked)
                              }>
                              {o.label}
                            </Checkbox>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              </Form.Item>
            </Col>
          )}

          <Col span={24} className='group-btn-action-form'>
            <hr className='w-100 mt-0' />
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit
            </Button>
            {form.getFieldValue('isUpdate') && (
              <Button
                danger
                disabled={loading}
                onClick={() =>
                  showConfirmDelete('', onDeleteAccount, 'Are you sure delete this account?')
                }>
                Delete
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </L.styleInput>
  );
};

export default AccountsAddComponent;
