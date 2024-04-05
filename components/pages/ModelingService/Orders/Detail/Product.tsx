import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import axios from 'axios';
import { CodeSandboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  CardProps,
  Col,
  Drawer,
  Form,
  Image,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from 'antd';
import { ValidateStatus } from 'antd/es/form/FormItem';
import { RcFile } from 'antd/lib/upload';

import { formatNumber, onBeforeUploadFile } from 'common/functions';
import { ProductFileFormat, validationUploadFile } from 'common/constant';
import convertFileName from 'common/functions/convertFileName';
import getBase64 from 'common/functions/getBase64';
import uploadFileServices from 'services/uploadFile-services';
import orderServices from 'services/modeling-service/order-services';

import RenderStatusComponent from '../Fragment/RenderStatus';
import DemoPreview from './DemoPreview';

import {
  ModelingOrderModel,
  ModelingProducts,
  ModelingStatus,
} from 'models/modeling-landing-page-orders';
import { PriceType } from 'models/modeling-landing-page-pricing';

import styled from 'styled-components';
import { PageContent } from 'styles/__styles';

type Props = {
  fieldListName: number;
  orderID: string;
  orderStatus: ModelingStatus;
  data: ModelingProducts;
  pricePackage: PriceType[];
  onUpdateOrder: Dispatch<SetStateAction<ModelingOrderModel>>;
};

const unit: { [key: number]: string } = {
  1: 'm',
  2: 'cm',
  3: 'mm',
};

export default function ModelingOrderProduct(props: Readonly<Props>) {
  const { fieldListName, orderID, orderStatus, data, pricePackage, onUpdateOrder } = props;

  const form = Form.useFormInstance();
  const [image, setImage] = useState<string>(data.image);
  const [uploadStatus, setUploadStatus] = useState<{ key: string; value: number }[]>([]);
  const [openDemo, setOpenDemo] = useState<boolean>(false);

  const allowUpload =
    !data.is_upload && [ModelingStatus.IN_PROGRESS, ModelingStatus.IN_REPAIR].includes(data.status);
  const allowConfirm =
    !data.is_upload && Boolean(data.image) && Boolean(data.file_demo) && Boolean(data.file_result);
  const maxPrice = pricePackage.sort((a, b) => b.price - a.price)[0].price;
  const products = Form.useWatch(['products', fieldListName], form);
  const packageID = Form.useWatch(['products', fieldListName, 'price_id'], form);
  const isFillPrice =
    pricePackage.find(({ id }) => id === packageID)?.price === 0 ||
    (orderStatus !== ModelingStatus.QUOTE && data.quote_price.price === 0);
  const isHaveFile =
    (products?.image?.length > 0 && products.image[0].originFileObj) ||
    (products?.file_demo?.length > 0 && products.file_demo[0].originFileObj) ||
    (products?.file_result?.length > 0 && products.file_result[0].originFileObj);
  const percentUpload =
    (uploadStatus.reduce((total, i) => total + i.value, 0) / (uploadStatus.length * 100)) * 100;

  const checkPricePackage = (): { validateStatus: ValidateStatus; help: ReactNode } | undefined => {
    if (orderStatus === ModelingStatus.QUOTE) {
      if (packageID) {
        const packageItem = pricePackage.find(({ id }) => id === packageID);
        if (data.quote_price && !packageItem?.status) {
          return {
            validateStatus: 'error',
            help: 'This package is inactive or has been deleted',
          };
        }
      }
    }
  };

  const onUpdateFieldValue = (param: {
    image?: string;
    file_demo?: string;
    file_result?: string;
  }) => {
    const products = form.getFieldValue('products');
    let productCurrent = products.find((i: any) => i.id === data.id);
    if (param.image) productCurrent['image'] = [{ url: param.image }];
    if (param.file_demo) productCurrent['file_demo'] = [{ name: param.file_demo }];
    if (param.file_result) productCurrent['file_result'] = [{ name: param.file_result }];
    products.splice(Number(fieldListName), 1, productCurrent);
    form.setFieldValue('products', products);
  };

  const onUpdateImage = async (file: RcFile) => setImage(await getBase64(file));

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onUploadFile = async (
    type: string,
    file: RcFile & { originFileObj: RcFile }
  ): Promise<[string, string] | undefined> => {
    try {
      setUploadStatus((current) => current.concat([{ key: file.uid, value: 0 }]));

      const { upload, download } = await uploadFileServices.uploadFilePresigned({
        filename: convertFileName(file.name),
        kind: 'public',
      });
      if (upload) {
        await axios.put(upload, file.originFileObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 1000 * 9999999999,
          transformRequest: (data, headers: any) => {
            delete headers.common['Authorization'];
            return data;
          },
          onUploadProgress: (progressEvent) => {
            const value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadStatus((current) => {
              const list = [...current];
              const orderItem = list.findIndex((i) => i.key === file.uid);
              if (orderItem !== -1) list.splice(orderItem, 1, { ...list[orderItem], value });
              return list;
            });
          },
        });
      }

      return [type, download];
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onSubmit = async ({ image: avatar, ...values }: any) => {
    try {
      setUploadStatus((current) => current.concat([{ key: 'submit', value: 0 }]));

      let body: Record<string, any> = {};
      if (avatar[0].originFileObj) {
        body['image'] = image;
        body['filename'] = avatar[0].name;
        body['filetype'] = avatar[0].type;
        if (data.image) body['oldImage'] = data.image;
      }

      await Promise.all(
        Object.keys(values)
          .filter((i) => values[i][0].originFileObj)
          .map((i) => onUploadFile(i, values[i][0]))
      ).then((res) => {
        res.forEach((i) => {
          if (i) body[i[0]] = i[1];
        });
      });

      if (body.file_demo && data.file_demo) body['file_demo_old'] = data.file_demo;
      if (body.file_result && data.file_result) body['file_result_old'] = data.file_result;

      await orderServices
        .uploadModelOrder({
          orderId: orderID,
          productId: data.id,
          params: body,
          config: {
            onUploadProgress: (progressEvent) => {
              const value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadStatus((current) => {
                const list = [...current];
                const orderItem = list.findIndex((i) => i.key === 'submit');
                if (orderItem !== -1) list.splice(orderItem, 1, { ...list[orderItem], value });
                return list;
              });
            },
          },
        })
        .then(({ data }) => {
          onUpdateOrder(data);
          onUpdateFieldValue({
            image: body.image,
            file_demo: body.file_demo ? convertFileName(values.file_demo[0].name) : undefined,
            file_result: body.file_result ? convertFileName(values.file_result[0].name) : undefined,
          });
        });

      setTimeout(() => setUploadStatus([]), 300);
    } catch (error) {
      setTimeout(() => setUploadStatus([]), 300);
    }
  };

  const onValidateFields = () => {
    form
      .validateFields([
        ['products', fieldListName, 'image'],
        ['products', fieldListName, 'file_demo'],
        ['products', fieldListName, 'file_result'],
      ])
      .then((value) => onSubmit(value.products[fieldListName]));
  };

  const onConfirmProduct = () => {
    const confirm = Modal.confirm({
      title: 'Are you sure of the confirmation of completion for this product?',
      content: 'Once confirmed, you will no longer be able to edit this product',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([
          confirm.update({ cancelButtonProps: { disabled: true } }),
          orderServices.confirmUploadModelOrder(data.id),
        ]).then(([_, { data }]) => {
          onUpdateOrder(data);
          message.success(
            'This product is complete, customers will receive notification via email.'
          );
        }),
    });
  };

  const cardProps: CardProps = {
    size: 'small',
    title: (
      <>
        <p>{data.name}</p>
        {data.is_change && (
          <Typography.Text className='font-weight-normal' type='warning' italic>
            This product has been changed, please check and change the package if necessary
          </Typography.Text>
        )}
      </>
    ),
    bordered: false,
    extra: (
      <Space>
        {uploadStatus.length > 0 && (
          <Progress
            className='d-flex'
            type='circle'
            width={32}
            percent={Number(percentUpload.toFixed(0))}
          />
        )}
        {allowUpload && (
          <Button
            type='primary'
            shape='round'
            ghost
            disabled={!isHaveFile}
            loading={uploadStatus.length > 0}
            onClick={onValidateFields}>
            {uploadStatus.length > 0 ? 'Uploading' : 'Upload'}
          </Button>
        )}
        {allowConfirm && (
          <Button
            type='primary'
            shape='round'
            disabled={uploadStatus.length > 0}
            onClick={onConfirmProduct}>
            Confirm
          </Button>
        )}
        {data.file_demo && (
          <Button
            type='text'
            size='small'
            icon={<CodeSandboxOutlined />}
            onClick={() => setOpenDemo(true)}>
            Demo
          </Button>
        )}
      </Space>
    ),
  };

  return (
    <PageContent>
      <Content {...cardProps}>
        <Row gutter={20}>
          <Col span={16}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label='Price'>{formatNumber(data.price, '$')}</Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Status'>
                  <RenderStatusComponent status={data.status} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Product size (Length | Width | Height)'>
                  {data.size['length']}*{data.size['width']}*{data.size['height']} {unit[data.unit]}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Link'>
                  <a className='ellipsis' href={data.link}>
                    {data.link}
                  </a>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Note'>
                  <p
                    dangerouslySetInnerHTML={{ __html: data.note }}
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Note (pose)'>
                  <p
                    dangerouslySetInnerHTML={{ __html: data.note }}
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='Attachment'>
                  <Image.PreviewGroup>
                    {data.modeling_product_files.map(({ id, link }) => (
                      <Image
                        key={id}
                        src={link}
                        alt=''
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  name={[fieldListName, 'price_id']}
                  label='Price package'
                  rules={[
                    {
                      required: orderStatus === ModelingStatus.QUOTE,
                      message: 'Please select a price package',
                    },
                    () => ({
                      validator(_, value) {
                        if (value && !pricePackage.some(({ id }) => id === value))
                          return Promise.reject(
                            new Error('This package is inactive or has been deleted')
                          );
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  validateStatus={checkPricePackage()?.validateStatus ?? 'validating'}
                  help={checkPricePackage()?.help}>
                  <Select
                    open={orderStatus !== ModelingStatus.QUOTE ? false : undefined}
                    options={pricePackage.map(({ id, title, price }) => ({
                      value: id,
                      label: title + (price ? ` (${formatNumber(price, '$')})` : ''),
                    }))}
                  />
                </Form.Item>
              </Col>
              {isFillPrice && (
                <Col span={24}>
                  <Form.Item
                    name={[fieldListName, 'price']}
                    label='Price'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the price for the selected price package',
                      },
                      () => ({
                        validator(_, value) {
                          if (value) {
                            if (!Number.isInteger(value))
                              return Promise.reject(new Error('Price must be an integer'));
                            else if (value < maxPrice + 1)
                              return Promise.reject(
                                new Error(
                                  'Price must be greater than ' + formatNumber(maxPrice, '$')
                                )
                              );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <InputNumber
                      className='w-100'
                      placeholder='Input price'
                      max={999}
                      readOnly={orderStatus !== ModelingStatus.QUOTE}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={24}>
                <Form.Item
                  name={[fieldListName, 'image']}
                  label='Avatar'
                  rules={[
                    { required: allowUpload, message: 'Please upload an avatar for the product' },
                  ]}
                  valuePropName='fileList'
                  getValueFromEvent={normFile}>
                  <Upload
                    listType='picture-card'
                    showUploadList={false}
                    maxCount={1}
                    accept={validationUploadFile.image.join(', ')}
                    disabled={!allowUpload}
                    beforeUpload={(file) =>
                      onBeforeUploadFile({ file, ruleSize: 2, callBack: onUpdateImage })
                    }>
                    {image ? (
                      <img src={image} alt='avatar' style={{ width: '100%' }} />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={[fieldListName, 'file_demo']}
                  label='File Demo'
                  rules={[
                    { required: allowUpload, message: 'Please upload a demo file for the product' },
                  ]}
                  valuePropName='fileList'
                  getValueFromEvent={normFile}>
                  <Upload
                    maxCount={1}
                    accept='.glb'
                    disabled={!allowUpload}
                    beforeUpload={(file) =>
                      onBeforeUploadFile({
                        file,
                        ruleType: ['glb'],
                        ruleSize: 10 * 1024,
                        msgError: 'File must be GLB and less than 10GB',
                      })
                    }>
                    {!data.is_upload && (
                      <Button icon={<UploadOutlined />} disabled={!allowUpload}>
                        Upload
                      </Button>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={[fieldListName, 'file_result']}
                  label='File Result'
                  rules={[
                    {
                      required: allowUpload,
                      message: 'Please upload a result file for the product',
                    },
                  ]}
                  valuePropName='fileList'
                  getValueFromEvent={normFile}>
                  <Upload
                    maxCount={1}
                    accept={'.zip,' + ProductFileFormat.map((i) => i.value).join(',.')}
                    disabled={!allowUpload}
                    beforeUpload={(file) =>
                      onBeforeUploadFile({
                        file,
                        ruleType: ['zip'].concat(ProductFileFormat.map((i) => i.value)),
                        ruleSize: 10 * 1024,
                        msgError: `File must be ${ProductFileFormat.map((i) => i.value).join(
                          ', '
                        )}, ZIP and less than 10GB`,
                      })
                    }>
                    {!data.is_upload && (
                      <Button icon={<UploadOutlined />} disabled={!allowUpload}>
                        Upload
                      </Button>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Drawer
        title='Preview demo model'
        open={openDemo}
        width={600}
        getContainer={false}
        style={{ position: 'absolute' }}
        maskStyle={{ background: 'rgba(0, 0, 0, 0.3)' }}
        onClose={() => setOpenDemo(false)}>
        <DemoPreview model={data.file_demo} />
      </Drawer>
    </PageContent>
  );
}

const Content = styled(Card)`
  .ant-card-head,
  .ant-card-body {
    padding: 0;
  }
  .ant-card-body {
    margin-top: 20px;
  }
  .ant-form-item-label label {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.75);
  }
  .ellipsis {
    max-width: 100%;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
