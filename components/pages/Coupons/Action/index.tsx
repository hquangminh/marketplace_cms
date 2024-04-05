import { useEffect, useState } from 'react';

import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd';

import couponServices from 'services/coupon-services';

import {
  capitalizeFirstLetter,
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
} from 'common/functions';
import { regex } from 'common/constant';

import Loading from 'components/fragments/Loading';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { CouponActionProps, CouponBodyRequestType } from 'models/coupon.models';

import * as SC from './style';

const CouponActionModal = (props: CouponActionProps) => {
  const { data } = props;

  const [form] = Form.useForm();
  const startDay = Form.useWatch('start', form);
  const expiredDay = Form.useWatch('expired', form);

  const [loading, setLoading] = useState<boolean>(false);
  const [isShowMaxOrder, setShowMaxOrder] = useState<boolean>(false);

  const disabled = props.type === 'view' || (typeof data?.used == 'number' && data?.used > 0);

  useEffect(() => {
    setShowMaxOrder(data?.type === 'percent');
  }, [data]);

  const onSubmit = async (values: CouponBodyRequestType) => {
    try {
      setLoading(true);

      let body: CouponBodyRequestType = { ...values };
      body.prefix = (values.prefix ?? '').toUpperCase();
      body.code = (values.code ?? '').toUpperCase();
      body.expired = moment(values.expired).format('YYYY-MM-DD');
      body.start = moment(values.start).format('YYYY-MM-DD');
      body.min_order = values.min_order || 0;
      body.max_discount = values.type === 'percent' ? values.max_discount || 0 : 0;

      const res = await (props.type === 'add'
        ? couponServices.addCoupon(body)
        : couponServices.updateCoupon(
            data?.id || '',
            data?.used === 0 ? body : { status: values.status }
          ));

      if (!res.error) {
        props.type === 'add'
          ? props.updateCouponList('add', '', res.data)
          : props.updateCouponList('update', res.data.id, res.data);
        handlerMessage(capitalizeFirstLetter(props.type || '') + ' coupon succeeded', 'success');
      } else if (res.error_code === 'COUPON_IS_EXISTS')
        handlerMessage('This coupon already exists', 'error');
      else
        handlerMessage(
          capitalizeFirstLetter(props.type || '') + ' coupon failed, please try again later',
          'error'
        );

      setLoading(false);
      props.onClose();
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const handelClose = () => {
    props.onClose();
    setShowMaxOrder(false);
  };

  const modalProps = {
    title: props.type
      ? props.type === 'view'
        ? data?.prefix + '-' + data?.code
        : capitalizeFirstLetter(props.type) + ' coupon'
      : '',
    visible: typeof props.type === 'string',
    centered: true,
    footer: null,
    maskClosable: props.type === 'view',
    destroyOnClose: true,
    afterClose: () => form.resetFields(),
    onCancel: handelClose,
  };

  const formProps = {
    form,
    labelCol: { span: 24 },
    onValuesChange: (changedValues: any) => {
      Object.keys(changedValues)[0] === 'type'
        ? setShowMaxOrder(changedValues.type === 'percent')
        : null;
    },
    wrapperCol: { span: 24 },
    onFinish: onSubmit,
  };

  return (
    <Modal {...modalProps}>
      {(props.loading || loading) && <Loading isOpacity />}
      <SC.Wrapper>
        <Form {...formProps}>
          <Row gutter={[10, 0]}>
            <Col span={12}>
              <Form.Item
                label='Prefix'
                name='prefix'
                initialValue={data?.prefix}
                rules={[
                  { required: true, message: 'Please input Prefix!' },
                  { whitespace: true },
                  {
                    pattern: new RegExp('^[a-zA-Z0-9]+$'),
                    message: '${label} does not contain special characters',
                  },
                ]}>
                <Input disabled={disabled} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Code'
                name='code'
                initialValue={data?.code}
                rules={[
                  { required: true, message: 'Please input Code!' },
                  { whitespace: true },
                  {
                    pattern: new RegExp('^[a-zA-Z0-9]+$'),
                    message: '${label} does not contain special characters',
                  },
                ]}>
                <Input disabled={disabled} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Type'
                name='type'
                initialValue={data?.type}
                rules={[
                  { required: true, message: 'Please select Type!' },
                  ({ getFieldValue, setFieldsValue, setFields }) => ({
                    validator(_, type) {
                      const valueDiscount = getFieldValue('value');
                      if (type === 'percent') {
                        if (valueDiscount > 100) {
                          setFields([
                            { name: 'value', errors: ['Value must be less than or equal to 100!'] },
                          ]);
                          setFieldsValue({ value: valueDiscount });
                        }
                      } else {
                        if (valueDiscount) {
                          setFields([{ name: 'value', errors: undefined }]);
                        }
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}>
                <Select disabled={disabled}>
                  <Select.Option key={'percent'}>Percent</Select.Option>
                  <Select.Option key={'price'}>Price</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Total coupons'
                name='amount'
                initialValue={data?.amount}
                rules={[
                  { required: true, message: 'Please input Amount!' },
                  {
                    pattern: regex.isInteger,
                    message: '${label} must be an integer',
                  },
                  ({ getFieldValue, setFields }) => ({
                    validator(_, value) {
                      const maxUsage = getFieldValue('reuse');
                      if (maxUsage) {
                        if (value < maxUsage) {
                          return Promise.reject(
                            new Error('${label} must be greater than maximum usage')
                          );
                        } else if (value >= maxUsage && !regex.isInteger.test(maxUsage)) {
                          setFields([
                            {
                              name: 'reuse',
                              errors: ['Maximum usage must be an integer'],
                            },
                          ]);
                        }
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}>
                <InputNumber className='w-100' min={1} disabled={disabled} max={500000} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Value'
                name='value'
                initialValue={data?.value}
                rules={[
                  { required: true, message: 'Please input Value!' },
                  {
                    pattern: regex.isInteger,
                    message: '${label} must be an integer',
                  },
                  () => ({
                    validator(_, value) {
                      if (isShowMaxOrder && value > 100) {
                        return Promise.reject(
                          new Error('Value must be less than or equal to 100!')
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}>
                <InputNumber
                  className='w-100'
                  min={1}
                  max={isShowMaxOrder ? 100 : 500000}
                  addonAfter={isShowMaxOrder ? '%' : undefined}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Minimum order'
                name='min_order'
                initialValue={data?.min_order === 0 ? null : data?.min_order}>
                <InputNumber className='w-100' min={1} disabled={disabled} />
              </Form.Item>
            </Col>

            {isShowMaxOrder && (
              <Col span={24}>
                <Form.Item
                  label='Max discount'
                  name='max_discount'
                  initialValue={data?.max_discount === 0 ? null : data?.max_discount}
                  rules={[
                    {
                      pattern: regex.isInteger,
                      message: '${label} must be an integer',
                    },
                  ]}>
                  <InputNumber className='w-50' disabled={disabled} min={1} max={500000} />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                label='Start date'
                name='start'
                initialValue={data?.expired ? moment(data?.start, 'YYYY-MM-DD') : null}
                rules={[{ required: true, message: 'Please select Start date!' }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  format={'YYYY-MM-DD'}
                  disabled={disabled}
                  inputReadOnly
                  disabledDate={(current) =>
                    current &&
                    (current < moment().startOf('day') ||
                      (expiredDay && current >= moment(new Date(expiredDay))))
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='End date'
                name='expired'
                initialValue={data?.expired ? moment(data?.expired, 'YYYY-MM-DD') : null}
                rules={[{ required: true, message: 'Please select End date' }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  format={'YYYY-MM-DD'}
                  disabled={props.type === 'view' || disabled}
                  inputReadOnly
                  disabledDate={(current) =>
                    current &&
                    (current < moment().endOf('day') ||
                      (startDay && current <= moment(new Date(startDay)).endOf('day')))
                  }
                />
              </Form.Item>
            </Col>

            {props.type === 'view' && (
              <Col span={12}>
                <Form.Item label='Used' name='used' initialValue={data?.used}>
                  <Input type='number' disabled={disabled} />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                label='Maximum usage'
                tooltip='Maximum number of uses a user is allowed'
                name='reuse'
                initialValue={data?.reuse}
                rules={[
                  { required: true, message: 'Please input Maximum usage!' },
                  {
                    pattern: regex.isInteger,
                    message: '${label} must be an integer',
                  },
                  ({ getFieldValue, setFields }) => ({
                    validator(_, value) {
                      const totalCoupon = getFieldValue('amount');
                      if (totalCoupon) {
                        if (value > totalCoupon) {
                          return Promise.reject(
                            new Error('${label} must be less than total coupons')
                          );
                        } else if (value >= totalCoupon && !regex.isInteger.test(totalCoupon)) {
                          setFields([{ name: 'amount', errors: undefined }]);
                        } else if (value <= totalCoupon && !regex.isInteger.test(totalCoupon)) {
                          setFields([
                            {
                              name: 'amount',
                              errors: ['Total coupons must be an integer'],
                            },
                          ]);
                        }
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}>
                <InputNumber min={1} className='w-100' disabled={disabled} max={500000} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                className='mb-0'
                label='Active'
                name='status'
                initialValue={data?.status}
                rules={[{ required: true, message: 'Please choose Active!' }]}>
                <Radio.Group disabled={props.type === 'view'}>
                  <Radio value={true}>True</Radio>
                  <Radio value={false}>False</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='mt-2 d-flex justify-content-between'>
              <div>
                <Button onClick={handelClose}>Close</Button>
              </div>
              <div>
                {props.type === 'view' &&
                !data?.used &&
                !data?.market_orders_aggregate.aggregate.count &&
                props.allowAction.remove ? (
                  <Button
                    className='ml-3'
                    type='primary'
                    danger
                    onClick={() =>
                      data &&
                      showConfirmDelete(
                        data.id,
                        props.onDelete,
                        'Are you sure delete this coupon?',
                        `${data.prefix}-${data.code}`
                      )
                    }>
                    Delete
                  </Button>
                ) : null}
                {props.type === 'view' && (
                  <Button
                    className='ml-3'
                    type='primary'
                    onClick={props.allowAction.add ? props.onChangeToEdit : onToastNoPermission}>
                    Edit
                  </Button>
                )}
                {(props.type === 'add' || props.type === 'edit') && (
                  <Button className='ml-3' type='primary' htmlType='submit'>
                    Submit
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </SC.Wrapper>
    </Modal>
  );
};

export default CouponActionModal;
