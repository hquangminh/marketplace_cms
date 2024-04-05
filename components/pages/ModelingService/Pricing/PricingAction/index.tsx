import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Col, Form, Input, InputNumber, Row, Select, Upload } from 'antd';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { theme } from 'common/constant';
import {
  generatorUUID,
  handlerMessage,
  onBeforeUploadFile,
  onCheckErrorApiMessage,
} from 'common/functions';

import modelingPriceServices from 'services/modeling-service/landing-page/pricing-services';

import Loading from 'components/fragments/Loading';

import { typeImg } from 'models/category.model';
import { ParamsType, PriceActionProps } from 'models/modeling-landing-page-pricing';

import styled from 'styled-components';

const PricingAction = (props: PriceActionProps) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [galleryRemove, setGalleryRemove] = useState<string[] | []>([]);

  const [galleryLists, setGalleryLists] = useState<typeImg[] | []>([]);

  const [loading, setLoading] = useState(false);

  const [showPriceInput, setShowPriceInput] = useState<boolean>(props.pricingDetail?.price !== 0);

  useEffect(() => {
    setShowPriceInput(props.pricingDetail?.price !== 0);
  }, [props.pricingDetail?.price]);

  const handleStatusChange = (value: boolean) => {
    setShowPriceInput(value);
    if (!value) {
      form.setFieldsValue({
        price: 0,
      });
    } else {
      form.setFieldsValue({
        price: null,
      });
    }
  };

  useEffect(() => {
    if (props.pricingDetail && Object.keys(props.pricingDetail).length > 0) {
      form.setFieldsValue({
        title: props.pricingDetail?.title,
        orderid: props.pricingDetail?.orderid,
        status: props.pricingDetail?.status,
        price: props.pricingDetail?.price,
        description: props.pricingDetail?.description?.length
          ? props.pricingDetail?.description
          : [],
      });

      setGalleryLists(
        props.pricingDetail.modeling_price_images.map((item) => ({
          id: item.id,
          image: item.link,
          filename: item.link.split('/').slice(-1)[0],
        }))
      );

      form.setFieldsValue({
        list_image: {
          file: {},
          fileList: props.pricingDetail.modeling_price_images.map((item) => ({
            image: item.link,
            id: item.id,
          })),
        },
      });
    } else {
      form.setFieldsValue({
        description: [''],
      });
    }
  }, [props.pricingDetail]);

  const onCallBackBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setGalleryLists((prevState: typeImg[] | [] | any) => [
        ...prevState,
        {
          id: generatorUUID(),
          image: reader.result || '',
          filetype: file.type || '',
          filename: file.name || '',
        },
      ]);
    };
  };

  const onRemoveGallery = (e: any, file: typeImg) => {
    e.preventDefault();
    e.stopPropagation();
    const newData = galleryLists.filter((item) => item.id !== file.id);
    if (newData.length <= 4) {
      form.setFieldsValue({ list_image: { fileList: [] } });
    }

    if (props.type === 'edit') {
      if (file.image?.startsWith('http')) {
        setGalleryRemove((prevState) => [...prevState, file.id as string]);
      }
    }

    if (!newData.length) {
      form.setFieldsValue({ list_image: undefined });
    }
    setGalleryLists(newData);
  };

  const onFetchUpdatePricing = async (id: string, paramUpload: ParamsType) => {
    try {
      const resp = await modelingPriceServices.updatePricing(id, paramUpload);

      if (!resp.error) {
        if (props.setPricingDetail) {
          props.setPricingDetail((prevState: any) => ({
            ...prevState,
            ...resp.data,
            modeling_price_images: resp.data.modeling_price_images,
          }));
        }
        handlerMessage('Update success', 'success');
        router.push('/modeling-service/landing-page/pricing');
        setGalleryRemove([]);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchCreatePricing = async (paramUpload: ParamsType) => {
    try {
      const resp = await modelingPriceServices.createPricing(paramUpload);

      if (!resp.error) {
        router.push('/modeling-service/landing-page/pricing');
        handlerMessage('Create success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onSubmit = (values: ParamsType) => {
    setLoading(true);
    const params: ParamsType = {
      title: values.title.trim(),
      description: values.description,
      list_image: [],
      status: values.status,
      orderid: values.orderid,
      price: values.price,
    };

    if (props.type === 'edit') {
      // Check remove old image
      if (galleryRemove.length) {
        params.list_oldImage = galleryRemove || undefined;
      }

      galleryLists.forEach((item) => {
        if (!item.image?.startsWith('http')) {
          params.list_image.push({
            filename: item.filename,
            filetype: item.filetype,
            image: item.image,
          });
        }
      });
      onFetchUpdatePricing(props.pricingDetail?.id as string, params);
    } else {
      params.list_image = galleryLists.map((item) => ({
        filename: item.filename,
        filetype: item.filetype,
        image: item.image,
      }));
      onFetchCreatePricing(params);
    }
  };

  return (
    <Pricing_wrapper>
      {(loading || props.loading) && <Loading fullPage isOpacity />}
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Row gutter={[0, 0]}>
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
            <Form.Item name='status' label='Status'>
              <Select
                className='w-100'
                defaultValue={false}
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
              label='Title'
              name='title'
              rules={[
                { required: true, message: 'Title is required' },
                { whitespace: true, message: 'Title cannot be blank' },
              ]}>
              <Input placeholder='Input title' disabled={props.type === 'view'} />
            </Form.Item>
          </Col>

          <Col span={18}>
            <Form.Item
              style={{ width: '95%' }}
              name='price'
              label='Price'
              rules={[
                { required: true, message: 'Price is required' },
                { type: 'number' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue('old_price')) return Promise.resolve();
                    if (value > getFieldValue('old_price')) {
                      return Promise.reject(
                        new Error('Image must be JPG, JPEG, PNG and less than 2MB')
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}>
              <InputNumber
                type='number'
                placeholder='Input price'
                className='price-input'
                min={showPriceInput ? 1 : 0}
                max={998}
                disabled={props.type === 'view' || !showPriceInput}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label='Select package'>
              <Select
                className='w-100'
                value={showPriceInput}
                style={{ width: 120 }}
                onChange={handleStatusChange}
                options={[
                  { value: true, label: 'Input Price' },
                  { value: false, label: 'Contact' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className='position-relative'>
              <Form.Item name='list_image' label='Upload gallery'>
                <Upload.Dragger
                  beforeUpload={(file) =>
                    onBeforeUploadFile({ file, callBack: onCallBackBeforeUpload })
                  }
                  disabled={props.type === 'view' || !showPriceInput}
                  multiple
                  listType='picture'
                  showUploadList={false}
                  className='ant-upload_my-custom'>
                  <p className='ant-upload-drag-icon'>
                    <CloudUploadOutlined />
                  </p>
                  <p className='ant-upload-text'>Drop image here or click to upload</p>
                </Upload.Dragger>
              </Form.Item>

              <Col span={24}>
                {galleryLists.map((item) => (
                  <div className='list' key={item.id}>
                    <div className='item p-2  d-flex justify-content-between align-items-center'>
                      <div className='box__img d-flex align-items-center' style={{ gap: '5px' }}>
                        <img src={item.image} alt='' style={{ width: '48px', height: '48px' }} />
                        {item.filename}
                      </div>

                      <Button
                        className='d-flex justify-content-center align-items-center'
                        onClick={(e) => onRemoveGallery(e, item)}
                        disabled={props.type === 'view'}>
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                ))}
              </Col>
            </div>
          </Col>

          <Col span={24} xl={24}>
            <Form.List
              name='description'
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error('At least 1 passengers'));
                    }
                  },
                },
              ]}>
              {(fields, { add, remove }) => (
                <>
                  <div className='d-flex justify-content-between mt-5'>
                    <h3 className='title_description'>Description</h3>
                    <div className='btn__add'>
                      <Button
                        type='primary'
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        disabled={props.type === 'view'}>
                        Add items
                      </Button>
                    </div>
                  </div>
                  {fields?.map(({ key, name }: any) => {
                    return (
                      <Row key={key} gutter={[10, 0]} align='middle' className={'form__list'}>
                        <Col span={24}>
                          <Form.Item
                            name={[name]}
                            rules={[
                              { required: true, message: 'Description is required' },
                              { whitespace: true, message: 'Do not enter spaces' },
                            ]}>
                            <Input
                              placeholder='Input description'
                              disabled={props.type === 'view'}
                            />
                          </Form.Item>
                        </Col>
                        <CloseCircleOutlined
                          disabled={props.type === 'view' || fields.length === 1}
                          className='btn__close'
                          onClick={() => remove(name)}
                        />
                      </Row>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Col>

          <Col className='group-btn-action-form group-btn-action-form-custom'>
            <hr className='w-100 mt-0' />
            <div className='text-right'>
              <Button
                type='default'
                className='mr-3'
                onClick={() => router.push('/modeling-service/landing-page/pricing')}>
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
    ::after {
      display: inline-block;
      margin-left: 2px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
`;

export default PricingAction;
