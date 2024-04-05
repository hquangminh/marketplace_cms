import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Upload } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';

import { fromEventNormFile, handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import { validationUploadFile } from 'common/constant';

import uploadFileServices from 'services/uploadFile-services';
import modelingBannerServices from 'services/modeling-banner';

import Loading from 'components/fragments/Loading';

import { ParamUploadS3 } from 'models/product.model';
import { BannerDetailType, ParamUploadType } from 'models/modeling-landing-page-banner';
import { typeImg } from 'models/category.model';

import * as L from './style';

type Props = {
  type?: 'edit' | 'view' | 'create';
  bannerDetail?: BannerDetailType | null;
  setBannerDetail?: React.Dispatch<React.SetStateAction<BannerDetailType | null>>;
  loading?: boolean;
  page?: 'banner' | 'banner-product';
  isUpdate?: boolean;
};

const BannerCreateComponent = (props: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const listImage = Form.useWatch('list_image', form);

  const [fileModel, setFileModel] = useState<typeImg[] | []>([]);

  const [galleryRemove, setGalleryRemove] = useState<string[] | []>([]);

  const [galleryLists, setGalleryLists] = useState<typeImg[] | []>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.bannerDetail && Object.keys(props.bannerDetail).length > 0) {
      const lisImages = props.bannerDetail.modeling_banner_images.map((item) => ({
        id: item.id,
        image: item.link,
        filename: item.link.split('/').slice(-1)[0],
        status: 'done',
        uid: item.id,
      }));
      form.setFieldsValue({
        title: props.bannerDetail.title,
        description: props.bannerDetail.description,
        model: [{ image: '', filename: '', filetype: '' }],
        status: props.bannerDetail.status,
        orderid: props.bannerDetail.orderid,
        list_image: lisImages,
      });

      setGalleryLists(lisImages);

      setFileModel([
        {
          image: props.bannerDetail?.model,
          filetype: '',
          filename: props.bannerDetail?.model.split('/').slice(-1)[0],
        },
      ]);
    }
  }, [props.bannerDetail]);

  const onFetchUploadFile = async ({
    paramS3,
    paramUpload,
  }: {
    paramS3: ParamUploadS3;
    paramUpload: ParamUploadType;
  }) => {
    axios({
      method: 'PUT',
      url: paramS3.url,
      data: paramS3.fileUpload,
      timeout: 9999 * 999999999,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers: any) => {
        delete headers.common['Authorization'];

        return data;
      },
    })
      .then(() => {
        paramUpload.model = paramS3.download as string;

        if (props.type === 'edit') {
          onFetchUpdateBanner({ paramUpload });
        } else {
          onFetchCreateBanner({ paramS3, paramUpload });
        }
      })
      .catch((error: any) => {
        onCheckErrorApiMessage(error);
        setLoading(false);
      });
  };

  const onFetchUploadPresigned = async ({
    paramS3,
    paramUpload,
  }: {
    paramS3: ParamUploadS3;
    paramUpload: ParamUploadType;
  }) => {
    try {
      const resp = await uploadFileServices.uploadFilePresigned({
        filename: paramS3.filename?.replace(/\s+/g, '_'),
        kind: 'public',
      });

      if (!resp.error) {
        paramS3.download = resp.download;
        paramS3.url = resp.upload;

        onFetchUploadFile({ paramS3, paramUpload });
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onFetchUpdateBanner = async ({ paramUpload }: { paramUpload: ParamUploadType }) => {
    try {
      const resp = await modelingBannerServices.updateModelingBanner(
        props.bannerDetail?.id as string,
        paramUpload
      );

      if (!resp.error) {
        if (props.setBannerDetail) {
          props.setBannerDetail((prevState: any) => ({
            ...prevState,
            ...resp.data,
            model: resp.data.model,
            modeling_banner_images: resp.data.modeling_banner_images,
          }));
        }
        setFileModel([
          {
            image: resp.data.model,
            filename: resp.data.model.split('/').slice(-1)[0],
          },
        ]);
        setGalleryLists(
          resp.data.modeling_banner_images?.map((item: any) => ({
            id: item.id,
            image: item.link,
            filename: item.link.split('/').slice(-1)[0],
          }))
        );
        handlerMessage('Update success', 'success');
        setGalleryRemove([]);
        setLoading(false);
        if (props.page === 'banner') {
          router.push('/modeling-service/landing-page/banner');
        } else {
          router.push('/modeling-service/landing-page/product');
        }
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchCreateBanner = async ({
    paramUpload,
    paramS3,
  }: {
    paramUpload: ParamUploadType;
    paramS3: ParamUploadS3;
  }) => {
    paramUpload.model = paramS3.download || '';

    try {
      const resp = await modelingBannerServices.createModelingBanner(paramUpload);

      if (!resp.error) {
        if (props.page === 'banner') {
          router.push('/modeling-service/landing-page/banner');
        } else {
          router.push('/modeling-service/landing-page/product');
        }
        handlerMessage('Create success', 'success');
      }
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onUploadChanges = ({ file, fileList }: any) => {
    form.setFields([{ name: 'list_image', errors: [] }]);
    if (props.isUpdate) {
      if (file.status === 'removed') {
        setGalleryRemove((prev) => [...prev, file.uid]);
      }
    }
    if (fileList.every((e: any) => e.status === 'done')) {
      setGalleryLists(fileList);
      form.setFieldsValue({
        list_image: fileList,
      });
    }
  };

  const onFinish = async (values: ParamUploadType) => {
    if (values.list_image.length !== 4) {
      form.setFields([{ name: 'list_image', errors: ['Please upload 4 galleries!'] }]);
      return;
    }

    setLoading(true);
    const params: ParamUploadType = {
      title: values.title.trim(),
      description: values.description.trim(),
      model: '',
      orderid: values.orderid,
      status: values.status,
      list_image: galleryLists
        .filter((f) => !(f.thumbUrl || f.image)?.startsWith('http'))
        .map((m) => ({
          filename: m.name || m.filename,
          filetype: m.type || m.filetype,
          image: m.thumbUrl || m.image,
        })),
      is_example: props.page === 'banner-product' ? true : false,
    };

    // Update banner
    if (props.type === 'edit') {
      // Check remove old image
      if (galleryRemove.length) {
        params.list_oldImage = galleryRemove || undefined;
      }

      // Check new model upload
      if (!fileModel[0].image?.startsWith('http')) {
        if (props.bannerDetail?.model) {
          params.oldModel = props.bannerDetail.model as string;
        }
        onFetchUploadPresigned({ paramS3: fileModel[0], paramUpload: params });
      } else {
        params.model = props.bannerDetail?.model as string;
        onFetchUpdateBanner({ paramUpload: params });
      }
    } else {
      onFetchUploadPresigned({ paramS3: fileModel[0], paramUpload: params });
    }
  };

  useEffect(() => {
    if (listImage?.length === 4) {
      form.setFields([{ name: 'list_image', errors: [] }]);
    }
  }, [listImage]);

  const defaultFileLists: any = props.bannerDetail?.modeling_banner_images.map((m) => ({
    uid: m.id,
    url: m.link,
    thumbUrl: m.link,
    filename: m.link.split('/').slice(-1)[0],
    name: m.link.split('/').slice(-1)[0],
    status: 'done',
  }));

  return (
    <L.BannerCreateComponent_wrapper>
      {props.loading ? (
        <Loading fullPage isOpacity />
      ) : (
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            title: props.bannerDetail?.title,
            description: props.bannerDetail?.description,
            model: [{ image: '', filename: '', filetype: '' }],
            status: props.bannerDetail?.status,
            orderid: props.bannerDetail?.orderid,
            list_image: defaultFileLists,
          }}>
          {loading && <Loading fullPage isOpacity />}
          <div className='content'>
            <Row gutter={[20, 0]}>
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

              <Col span={24}>
                <Form.Item
                  label='Description'
                  name='description'
                  rules={[
                    { required: true, message: 'Description is required' },
                    { whitespace: true, message: 'Description cannot be blank' },
                  ]}>
                  <Input.TextArea
                    placeholder='Input description'
                    disabled={props.type === 'view'}
                    rows={5}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='Active' name='status' valuePropName='checked'>
                  <Checkbox disabled={props.type === 'view'} />
                </Form.Item>
              </Col>

              {props.page === 'banner-product' ? (
                <Col span={24}>
                  <Form.Item label='Order id' name='orderid' initialValue={0}>
                    <InputNumber
                      min={0}
                      className='w-100'
                      placeholder='Input order id'
                      disabled={props.type === 'view'}
                    />
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

              <Col span={24}>
                <Form.Item
                  name='model'
                  label='Upload model'
                  required
                  className='ant-upload_my-custom ant-upload-file_my-custom'
                  getValueFromEvent={(e) =>
                    fromEventNormFile({
                      file: e.target.files[0],
                      name: 'model',
                      type: ['glb'],
                      form,
                      ruleSize: 10,
                      setFileList: setFileModel,
                      isUpdate: form.getFieldValue('isUpdate'),
                      multiple: false,
                      typeUpload: 'file',
                    })
                  }
                  rules={[
                    ({}) => ({
                      validator() {
                        if (!fileModel[0]?.image) {
                          return Promise.reject(new Error('Model is required'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <span id='model'>
                    {fileModel[0]?.image ? (
                      <div className='image_wrapper image_wrapper--file'>
                        <PaperClipOutlined />
                        <p className='file-name'>{fileModel[0].filename}</p>
                        <Button
                          disabled={props.type === 'view'}
                          className='btn-delete'
                          onClick={() => {
                            setFileModel([]);
                            form.setFieldsValue({ model: undefined });
                          }}>
                          <DeleteOutlined />
                        </Button>
                      </div>
                    ) : (
                      <Upload showUploadList={false} maxCount={1} disabled={props.type === 'view'}>
                        <Button
                          className='d-flex align-items-center'
                          icon={<UploadOutlined />}
                          disabled={props.type === 'view'}>
                          Upload (.glb)
                        </Button>
                      </Upload>
                    )}
                  </span>
                </Form.Item>
              </Col>

              <Col span={24}>
                <L.Gallery_wrapper>
                  <Upload.Dragger
                    beforeUpload={(file, filesArray) => {
                      const isPNG = validationUploadFile.image.includes(file.type);
                      const isLimitSize = file.size / 1024 / 1024 < 2;

                      const isCheckMsgErr =
                        !isPNG ||
                        !isLimitSize ||
                        form.getFieldValue('list_image')?.length === 4 ||
                        galleryLists.length === 4 ||
                        filesArray.length > 4 ||
                        filesArray?.length + galleryLists?.length > 4;
                      if (isCheckMsgErr) {
                        handlerMessage(
                          'Only uploads up to 4 images, JPG, WEBP, PNG, JPEG file, under 2MB in size!',
                          'error',
                          undefined,
                          'upload'
                        );
                      }

                      return (isPNG && isLimitSize) || Upload.LIST_IGNORE;
                    }}
                    defaultFileList={defaultFileLists}
                    maxCount={4}
                    disabled={props.type === 'view'}
                    multiple
                    onDrop={(e) => {
                      const file = e.dataTransfer.files[0];
                      const isPNG = validationUploadFile.image.includes(file.type);
                      const isLimitSize = file.size / 1024 / 1024 < 2;

                      const isCheckMsgErr =
                        !isPNG ||
                        !isLimitSize ||
                        form.getFieldValue('list_image')?.length === 4 ||
                        galleryLists.length === 4;

                      if (isCheckMsgErr) {
                        handlerMessage(
                          'Only uploads up to 4 images, JPG, WEBP, PNG, JPEG file, under 2MB in size!',
                          'error',
                          undefined,
                          'upload'
                        );
                      }
                    }}
                    onChange={onUploadChanges}
                    listType='picture'
                    accept={validationUploadFile.image.toString()}
                    className='ant-upload_my-custom'>
                    <p className='ant-upload-drag-icon'>
                      <CloudUploadOutlined />
                    </p>
                    <p className='ant-upload-text'>
                      Drop image here or click to upload (4 galleries)
                    </p>
                  </Upload.Dragger>

                  <Form.Item
                    className='form-item-only-label'
                    name='list_image'
                    rules={[
                      ({}) => ({
                        validator() {
                          if (galleryLists.length === 4) {
                            return Promise.resolve();
                          } else if (galleryLists.length === 0) {
                            return Promise.reject(new Error('Gallery is required'));
                          }
                          return Promise.reject(new Error('Please upload 4 galleries!'));
                        },
                      }),
                    ]}
                  />
                </L.Gallery_wrapper>
              </Col>
            </Row>
          </div>

          <Col className='group-btn-action-form group-btn-action-form-custom'>
            <hr className='w-100 mt-0' />
            <div className='text-right'>
              <Button
                type='default'
                className='mr-3'
                onClick={() =>
                  router.push(
                    `/modeling-service/landing-page/${
                      props.page === 'banner' ? 'banner' : 'product'
                    }`
                  )
                }>
                Cancel
              </Button>

              {props.type === 'view' ? (
                <Button
                  type='primary'
                  onClick={() =>
                    router.push(
                      `/modeling-service/landing-page/${
                        props.page === 'banner' ? 'banner' : 'product'
                      }/edit/${props.bannerDetail?.id}`
                    )
                  }>
                  Edit
                </Button>
              ) : (
                ''
              )}
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
        </Form>
      )}
    </L.BannerCreateComponent_wrapper>
  );
};

export default BannerCreateComponent;
