import { useEffect, useState } from 'react';

import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Row, Typography, Upload } from 'antd';
import { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';

import { onUpdateProfile } from 'redux/action/auth';
import { useAppDispatch } from 'redux/hooks';

import { capitalizeFirstLetter, getBase64, onBeforeUploadFile } from 'common/functions';
import { listPermission, optionsPermission, validationUploadFile } from 'common/constant';

import { userType, PermissionType } from 'models/auth.model';
import { DataAdminAccount } from 'models/administrator.model';

import * as SC from './style';

type Props = {
  data?: userType;
  loadingUpdate?: boolean;
};

const ProfileChangeInfo = ({ data, loadingUpdate }: Props) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState<string | undefined>(data?.image ?? undefined);

  const onChangeUpload: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.fileList[0].originFileObj) getBase64(info.fileList[0].originFileObj, setImageUrl);
  };

  const onChangeInfo = ({ avatar, ...values }: any) => {
    const params: DataAdminAccount = {
      ...values,
      image: avatar?.[0]?.name ? imageUrl : undefined,
    };
    dispatch(onUpdateProfile({ id: data?.id, parm: params }));
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        username: data.username,
        group: capitalizeFirstLetter(data.group ?? ''),
      });
    }
  }, [data]);

  const getPermisByPage = (values: PermissionType, page: string, action: string) => {
    let permisPage;
    switch (page) {
      case 'category':
        permisPage = values.category;
        break;
      case 'products':
        permisPage = values.products;
        break;
      case 'users':
        permisPage = values.users;
        break;
      case 'orders':
        permisPage = values.orders;
        break;
      case 'coupons':
        permisPage = values.coupons;
        break;
      case 'reports':
        permisPage = values.reports;
        break;
      case 'media':
        permisPage = values.media;
        break;
      case 'seo':
        permisPage = values.seo;
        break;
      case 'help':
        permisPage = values.help;
        break;
      case 'blog':
        permisPage = values.blog;
        break;
      case 'banner':
        permisPage = values.banner;
        break;
      case 'license':
        permisPage = values.license;
        break;
      case 'withdraw':
        permisPage = values.withdraw;
        break;
      case 'notification':
        permisPage = values.notification;
        break;
      case 'showroom':
        permisPage = values.showroom;
        break;
      default:
        break;
    }
    switch (action) {
      case 'list':
        return permisPage?.list;
      case 'read':
        return permisPage?.read;
      case 'write':
        return permisPage?.write;
      case 'remove':
        return permisPage?.remove;
      default:
        return false;
    }
  };

  return (
    <SC.Profile_ChangeInfo>
      <Form form={form} layout='vertical' onFinish={onChangeInfo}>
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item
              name='avatar'
              className='field-upload'
              valuePropName='fileList'
              normalize={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
              initialValue={data?.image ? [{ url: data.image }] : undefined}>
              <Upload
                maxCount={1}
                disabled={loadingUpdate}
                listType='picture-card'
                showUploadList={false}
                accept={validationUploadFile.image.toString()}
                beforeUpload={(file) =>
                  onBeforeUploadFile({
                    file,
                    ruleType: validationUploadFile.image,
                    msgError: 'Image must be JPG, WEBP, PNG, JPEG and less than 2MB',
                  })
                }
                onChange={onChangeUpload}>
                {imageUrl || data?.image ? (
                  <div className='position-relative h-100 w-100 image_wrapper'>
                    <span className='btn-upload rounded-circle'>
                      <EditFilled />
                    </span>
                    <img
                      src={imageUrl ?? data?.image ?? ''}
                      alt=''
                      className='rounded-circle w-100 h-100'
                    />
                  </div>
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              name='name'
              label='Name'
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Please enter your Name' },
                { whitespace: true, message: 'Cannot be empty' },
              ]}
              initialValue={data?.name}>
              <Input disabled={loadingUpdate} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              name='username'
              label='Username'
              labelCol={{ span: 24 }}
              initialValue={data?.username}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item name='email' label='E-mail'>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              name='group'
              label='Group'
              labelCol={{ span: 24 }}
              initialValue={data?.group}>
              <Input disabled />
            </Form.Item>
          </Col>

          {data?.permis && (
            <Col span={24} className='list_permission pt-3'>
              {listPermission.map((i, index) => {
                return (
                  <div key={index} className='mb-2'>
                    <Typography.Text className='d-inline-block' style={{ width: '120px' }}>
                      {i}
                    </Typography.Text>
                    {optionsPermission.map((o) => {
                      return (
                        <Checkbox
                          key={o.value}
                          checked={
                            data.permis
                              ? getPermisByPage(data.permis, i.toLowerCase(), o.value)
                              : false
                          }>
                          {o.label}
                        </Checkbox>
                      );
                    })}
                  </div>
                );
              })}
            </Col>
          )}
        </Row>

        <div className='text-right pt-3'>
          <Button type='primary' htmlType='submit' loading={loadingUpdate}>
            Update
          </Button>
        </div>
      </Form>
    </SC.Profile_ChangeInfo>
  );
};

export default ProfileChangeInfo;
