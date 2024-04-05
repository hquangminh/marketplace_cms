import React, { memo, useEffect } from 'react';

import { Button, Col, Form, Input, Modal, Row, Upload } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form/Form';

import { fromEventNormFile } from 'common/functions';
import { regex, validationUploadFile } from 'common/constant';

import Loading from 'components/fragments/Loading';

import { BannerModel, ParamsType } from 'models/banner.model';
import { typeImg } from 'models/category.model';

import * as L from './style';

type Props = {
  /* eslint-disable no-unused-vars */
  modalLists: {
    isShow: boolean;
    data: BannerModel | null;
    type: 'create' | 'edit' | '';
  };
  setModalLists: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      data: BannerModel | null;
      type: 'create' | 'edit' | '';
    }>
  >;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onFetchEditBanner: (id: string, body: ParamsType) => void;
  // eslint-disable-next-line no-unused-vars
  onFetchCreateBanner: (body: ParamsType) => void;
  form: FormInstance;
  fileList: typeImg[];
  setFileList: React.Dispatch<React.SetStateAction<typeImg[]>>;
};

const ModalComponent = (props: Props) => {
  const {
    modalLists,
    setModalLists,
    loading,
    onFetchEditBanner,
    onFetchCreateBanner,
    form,
    fileList,
    setFileList,
  } = props;

  const onRemoveFile = () => {
    setFileList([]);
    form.setFieldsValue({
      image: undefined,
    });
  };

  useEffect(() => {
    if (modalLists.type === 'edit') {
      form.setFieldsValue({
        link: modalLists.data?.link,
        image: modalLists.data?.image,
      });

      setFileList([
        {
          uid: '',
          name: modalLists.data?.image?.split('/')[modalLists.data?.image?.split('/').length - 1],
          image: modalLists.data?.image || '',
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [modalLists]);

  const onSubmit = (values: ParamsType) => {
    const params: ParamsType = {
      ...values,
      image: fileList[0].image || '',
      filename: fileList[0].filename || '',
      filetype: fileList[0].filetype || '',
    };

    if (modalLists.type === 'edit') {
      onFetchEditBanner(modalLists.data?.id as string, params);
      return;
    }

    onFetchCreateBanner(params);
  };

  return (
    <Modal
      title='Create banner'
      centered
      visible={modalLists.isShow}
      destroyOnClose={true}
      footer={null}
      onCancel={() => setModalLists(() => ({ isShow: false, data: null, type: 'create' }))}>
      {loading && <Loading isOpacity />}
      <L.ModalComponent_wrapper>
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onFinish={onSubmit} form={form}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                label='Link'
                name='link'
                rules={[
                  { required: true, message: 'Please input link!' },
                  { whitespace: true, message: 'Link cannot be empty' },
                  {
                    pattern: regex.url,
                    message: 'This field must be a valid url.',
                  },
                ]}>
                <Input placeholder='Enter the link to navigate' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='image'
                label='Banner image (500*261)'
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
                rules={[{ required: true, message: 'Banner image is required' }]}>
                {fileList.length === 0 && (
                  <span id='image'>
                    <Upload
                      showUploadList={false}
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={(file) => {
                        return false;
                      }}
                      accept='image/jpeg, image/png, image/gif'>
                      <div>
                        <UploadOutlined />
                        <p>Upload</p>
                      </div>
                    </Upload>
                  </span>
                )}
              </Form.Item>
            </Col>

            {fileList[0]?.image && (
              <L.PreviewIMG className='position-relative'>
                <img src={fileList[0].image} className='w-100 h-100' alt='' />
                <span
                  className='btn-delete d-flex align-items-center justify-content-center'
                  onClick={onRemoveFile}>
                  <CloseOutlined />
                </span>
              </L.PreviewIMG>
            )}

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='mt-2 d-flex justify-content-between'>
              <div>
                <Button
                  onClick={() =>
                    setModalLists(() => ({ isShow: false, data: null, type: 'create' }))
                  }>
                  Close
                </Button>
              </div>
              <div>
                <Button className='ml-3' type='primary' htmlType='submit'>
                  {modalLists.type === 'edit' ? 'Update' : 'Submit'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </L.ModalComponent_wrapper>
    </Modal>
  );
};

export default memo(ModalComponent);
