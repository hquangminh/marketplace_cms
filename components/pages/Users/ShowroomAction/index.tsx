import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Col, Form, Input, Row, Upload, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

import { fromEventNormFile, handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import isEmail from 'validator/lib/isEmail';
import { theme, validationUploadFile } from 'common/constant';

import showroomServices from 'services/showroom-services';
import MyImage from 'components/fragments/Image';
import { ShowroomActionProps, ShowroomUpdate } from 'models/showroom.models';
import { typeImg } from 'models/category.model';

import styled from 'styled-components';

const ShowroomAction = (props: ShowroomActionProps) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<typeImg[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveType, setSaveType] = useState<'save'>();

  useEffect(() => {
    if (props.showroomDetail && Object.keys(props.showroomDetail).length > 0) {
      form.setFieldsValue({
        name: props.showroomDetail?.name,
        username: props.showroomDetail?.nickname,
        email: props.showroomDetail?.email,
        image: props.showroomDetail?.image,
      });

      setFileList([
        {
          uid: '',
          image: props.showroomDetail?.image || '',
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [props.showroomDetail]);

  const onSaveSendMail = async (id: string) => {
    return Modal.confirm({
      title: `Are you sure want to send email this user?`,
      centered: true,
      onOk: async () => {
        await showroomServices
          .sendMail(id)
          .then(() => {
            router.push('/users?tab=showroom');
            handlerMessage('Send Email success', 'success');
          })
          .catch((error) => {
            onCheckErrorApiMessage(error);
          });
      },
    });
  };

  const onFetchCreateShowroom = async (body: ShowroomUpdate) => {
    setLoading(true);

    try {
      const resp = await showroomServices.createShowroom(body);

      if (!resp.error) {
        if (saveType) {
          onSaveSendMail(resp.data.id);
        } else {
          router.push('/users?tab=showroom');
          handlerMessage('Create success', 'success');
        }
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchUpdateShowroom = async (id: string, body: ShowroomUpdate) => {
    setLoading(true);
    try {
      const resp = await showroomServices.updateShowroom(id, body);

      if (!resp.error) {
        if (props.setShowroomDetail) {
          props.setShowroomDetail((prevState: any) => ({
            ...prevState,
            ...resp.data,
            modeling_price_images: resp.data.modeling_price_images,
          }));
        }
        setLoading(false);
        setFileList([]);

        form.resetFields();

        handlerMessage('Update success', 'success');
        router.push('/users?tab=showroom');
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onRemoveFile = () => {
    setFileList([]);
    form.setFieldsValue({
      image: undefined,
    });
  };

  const onSubmit = (values: any) => {
    setLoading(true);
    const params: ShowroomUpdate = {
      id: values.id?.trim(),
      username: values.username?.trim(),
      name: values.name?.trim(),
      email: values.email?.trim(),
    };

    const fileUpload = fileList.find((i) => i.fileUpload);

    if (fileUpload) {
      params.image = fileList[0]?.image || '';
      params.filename = fileList[0]?.name || '';
      params.filetype = fileList[0]?.filetype || '';
    }

    if (props.type === 'edit') {
      onFetchUpdateShowroom(props.showroomDetail?.id as string, params);
      return;
    }
    onFetchCreateShowroom(params);
  };

  return (
    <Pricing_wrapper>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Form.Item
              name='image'
              label='Logo'
              className='ant-upload_my-custom'
              rules={[{ required: true, message: 'Logo is required' }]}
              getValueFromEvent={(e) =>
                fromEventNormFile({
                  file: e.target.files[0],
                  name: 'image',
                  form,
                  type: validationUploadFile.image,
                  setFileList,
                  ruleSize: 2,
                  isUpdate: form.getFieldValue('isUpdate'),
                  msgError: 'Image must be PNG, JPG, JPEG, WEBP and less than 2MB',
                })
              }>
              <span id='image'>
                <Upload
                  showUploadList={false}
                  listType='picture-card'
                  maxCount={1}
                  accept={validationUploadFile.image.toString()}>
                  {fileList[0]?.image ? (
                    <div className={`image_wrapper position-relative`}>
                      <MyImage
                        className='showroom_logo'
                        src={fileList[0].image}
                        imgErr='/static/images/avatar-default.png'
                        alt=''
                      />

                      <Button className='btn-delete' onClick={onRemoveFile}>
                        <DeleteOutlined />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined />
                      <p>Upload</p>
                    </div>
                  )}
                </Upload>
              </span>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='User Name'
              name='username'
              rules={[
                { required: true, message: 'username is required' },
                { whitespace: true, message: 'username cannot be blank' },
              ]}>
              <Input placeholder='Input Username' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Name'
              name='name'
              rules={[
                { required: true, message: 'name is required' },
                { whitespace: true, message: 'name cannot be blank' },
              ]}>
              <Input maxLength={30} showCount placeholder='Input Name' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(new Error('Email is required'));
                    } else if (!value.trim()) {
                      return Promise.reject(new Error('Email name cannot be blank!'));
                    } else if (isEmail(value.trim())) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('The input is not a valid email'));
                    }
                  },
                },
              ]}>
              <Input placeholder='Input Email' />
            </Form.Item>
          </Col>

          <Col className='group-btn-action-form group-btn-action-form-custom'>
            <hr className='w-100 mt-0' />
            <div className='text-right'>
              <Button
                type='default'
                className='mr-3'
                onClick={() => router.push('/users?tab=showroom')}>
                Cancel
              </Button>

              {props.type === 'edit' ? (
                <Button
                  danger
                  className='mr-3'
                  onClick={() => onSaveSendMail(props.showroomDetail?.id as string)}>
                  Send Mail
                </Button>
              ) : (
                ''
              )}

              {props.type === 'edit' ? (
                <Button
                  type='primary'
                  className='mr-3'
                  htmlType='submit'
                  loading={loading && !saveType}>
                  Update
                </Button>
              ) : (
                ''
              )}

              {props.type === 'create' ? (
                <Button
                  type='primary'
                  className='mr-3'
                  htmlType='submit'
                  loading={loading && !saveType}>
                  Create
                </Button>
              ) : (
                ''
              )}

              {props.type === 'create' && (
                <Button
                  danger
                  className='mr-3'
                  loading={loading && saveType === 'save'}
                  onClick={() => {
                    setSaveType('save');
                    form.submit();
                  }}>
                  Save & Send Mail
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Form>
    </Pricing_wrapper>
  );
};

const Pricing_wrapper = styled.div`
  position: relative;
  .ant-input-number,
  .price-input {
    width: 100%;
  }
  .ant-upload {
    background-color: none;
  }
  .ant-upload,
  .ant-upload-select,
  .ant-upload-select-picture-card {
    background-color: none;
    border: none;
  }
  .btn-submit {
    text-align: right;
  }
  .title__line {
    font-size: 15px;
  }
  .form__list {
    position: relative;
    padding: 5px 5px;
    margin-bottom: 6px;
    border-radius: 2px;
    width: 98%;
    .btn__close {
      position: absolute;
      right: -2%;
      top: 20%;
      color: ${theme.primary_color};

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .btn__add {
    padding-right: 35px;
  }
  .ant-btn-block {
    padding: 0 50px;
    text-align: center;
  }
  .group-btn-action-form-custom {
    width: 100%;
    padding: 15px 0;
  }
  .title_description {
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: 500;
  }
`;

export default ShowroomAction;
