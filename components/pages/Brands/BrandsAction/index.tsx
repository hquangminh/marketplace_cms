import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Col, Form, Input, Row, Select, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

import { fromEventNormFile, handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import { regex, theme, validationUploadFile } from 'common/constant';

import brandsServices from 'services/brands-services';
import Loading from 'components/fragments/Loading';

import { BrandsActionProps, ParamsType } from 'models/brands-model';
import { typeImg } from 'models/category.model';

import styled from 'styled-components';

const BrandsAction = (props: BrandsActionProps) => {
  const [form] = Form.useForm();
  const { setBrandsDetail, brandsDetail } = props;

  const [fileList, setFileList] = useState<typeImg[] | []>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.brandsDetail && Object.keys(props.brandsDetail).length > 0) {
      form.setFieldsValue({
        status: props.brandsDetail?.status,
        title: props.brandsDetail?.title,
        website: props.brandsDetail?.website,
        contact: props.brandsDetail?.contact,
        image: props.brandsDetail?.image,
      });

      setFileList([{ uid: '', image: props.brandsDetail?.image || '' }]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [props.brandsDetail]);

  const onFetchUpdateBrands = async (id: string, body: ParamsType) => {
    setLoading(true);
    try {
      const resp = await brandsServices.updateBrands(id, body);

      if (!resp.error) {
        if (setBrandsDetail) {
          setBrandsDetail((prevState: any) => ({
            ...prevState,
            ...resp.data,
            modeling_price_images: resp.data.modeling_price_images,
          }));
        }
        setLoading(false);
        setFileList([]);

        form.resetFields();

        handlerMessage('Update success', 'success');
        router.push('/brands');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onFetchCreateBrands = async (body: ParamsType) => {
    setLoading(true);

    try {
      const resp = await brandsServices.createBrands(body);

      if (!resp.error) {
        router.push('/brands');
        handlerMessage('Create success', 'success');
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

  const onSubmit = (values: ParamsType) => {
    setLoading(true);
    const params: ParamsType = {
      status: values.status,
      title: values.title.trim(),
      website: values.website.trim(),
      contact: values.contact.trim(),
      image: fileList[0].image || '',
      filename: fileList[0].filename || '',
      filetype: fileList[0].filetype || '',
    };
    if (props.type === 'edit') {
      onFetchUpdateBrands(brandsDetail?.id as string, params);
      return;
    }

    onFetchCreateBrands(params);
  };

  return (
    <Pricing_wrapper>
      {(loading || props.loading) && <Loading fullPage isOpacity />}

      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Form.Item
              name='image'
              label='Logo'
              className='ant-upload_my-custom'
              getValueFromEvent={(e) =>
                fromEventNormFile({
                  file: e.target.files[0],
                  name: 'image',
                  form,
                  type: validationUploadFile.allImage,
                  setFileList,
                  ruleSize: 2,
                  isUpdate: form.getFieldValue('isUpdate'),
                })
              }
              rules={[{ required: true, message: 'Image is required' }]}>
              <span id='image'>
                <Upload
                  showUploadList={false}
                  listType='picture-card'
                  maxCount={1}
                  accept={validationUploadFile.allImage.toString()}>
                  {fileList[0]?.image ? (
                    <div className={`image_wrapper position-relative`}>
                      <img src={fileList[0].image} className='w-100 h-100' alt='' />
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
            <Form.Item name='status' label='Status'>
              <Select
                className='w-100'
                defaultValue={true}
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
              label='Name'
              name='title'
              rules={[
                { required: true, message: 'Title is required' },
                { whitespace: true, message: 'Title cannot be blank' },
              ]}>
              <Input placeholder='Input title' disabled={props.type === 'view'} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Website'
              name='website'
              rules={[
                { required: true, message: 'Website is required' },
                { whitespace: true, message: 'Website cannot be blank' },
                {
                  pattern: regex.url,
                  message: 'This field must be a valid url.',
                },
              ]}>
              <Input type='url' placeholder='Input website' disabled={props.type === 'view'} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label='Contact'
              name='contact'
              rules={[
                { required: true, message: 'Contact is required' },
                { whitespace: true, message: 'Contact cannot be blank' },
              ]}>
              <Input placeholder='Input contact' disabled={props.type === 'view'} />
            </Form.Item>
          </Col>

          <Col className='group-btn-action-form group-btn-action-form-custom'>
            <hr className='w-100 mt-0' />
            <div className='text-right'>
              <Button type='default' className='mr-3' onClick={() => router.push('/brands')}>
                Cancel
              </Button>

              {props.type !== 'view' && props.type !== 'edit' ? (
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              ) : (
                ''
              )}

              {props.type === 'edit' ? (
                <Button type='primary' htmlType='submit'>
                  Update
                </Button>
              ) : (
                ''
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

export default BrandsAction;
