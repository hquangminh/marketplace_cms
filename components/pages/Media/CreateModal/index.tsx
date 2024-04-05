import { useState } from 'react';
import axios from 'axios';

import { Button, Col, Form, Input, Modal, Row, Upload } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';

import { fromEventNormFile, handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import { validationUploadFile } from 'common/constant';

import mediaServices from 'services/media-services';
import uploadFileServices from 'services/uploadFile-services';

import Loading from 'components/fragments/Loading';

import { typeImg } from 'models/category.model';
import { createModalComponentProps, mediaListType } from 'models/media.models';

import * as SC from './style';

const CreateModal = ({
  isShowModal,
  onClose,
  setMediaList,
  mediaList,
}: createModalComponentProps) => {
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<typeImg[] | any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const onResetForm = () => {
    form.resetFields();
    onClose();
    setFileList([]);
  };

  const onRemoveFile = () => {
    setFileList([]);
    form.setFieldsValue({
      image: undefined,
    });
  };

  const onFetchCreateImage = async (parm: any) => {
    setLoading(true);
    try {
      if (parm.filetype.startsWith('video')) {
        const parmUpload = {
          filename: parm.filename,
          kind: 'public',
          filetype: parm.filetype,
        };
        const res = await uploadFileServices.uploadFilePresigned(parmUpload);

        await axios({
          method: 'put',
          url: res.upload,
          data: parm.fileUpload,
          timeout: 1000 * 9999999999,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, headers: any) => {
            delete headers.common['Authorization'];

            return data;
          },
        })
          .then(() => {
            parm.image = res.download;
          })
          .catch((error: any) => {
            onCheckErrorApiMessage(error);
          });
      } else {
        delete parm['fileUpload'];
      }

      const resp = await mediaServices.createImage(parm);

      setLoading(false);
      setMediaList((prevState: mediaListType) => ({
        ...prevState,
        data: [resp.data, ...mediaList],
        total: prevState.total + 1,
      }));
      onResetForm();
      handlerMessage('Create success', 'success');
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onSubmit = async (value: any) => {
    const parm = {
      title: value.name,
      ...fileList[0],
    };
    onFetchCreateImage(parm);
  };

  return (
    <Modal
      title='Create media'
      centered
      footer={null}
      destroyOnClose
      visible={isShowModal}
      onCancel={onResetForm}>
      {loading && <Loading isOpacity />}
      <SC.Wrapper>
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onFinish={onSubmit} form={form}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Please input name!' }, { whitespace: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='image'
                label='Media'
                className='ant-upload_my-custom'
                getValueFromEvent={(e) =>
                  fromEventNormFile({
                    file: e.target.files[0],
                    name: 'image',
                    form,
                    type: validationUploadFile.allImageAndVideo,
                    setFileList,
                    msgError:
                      'Only uploads Image must be JPG, WEBP, PNG, JPEG, GIF less than 2MB, or VIDEO less than 5MB',
                    isUpdate: form.getFieldValue('isUpdate'),
                  })
                }
                rules={[{ required: true, message: 'Avatar is required' }]}>
                {fileList.length === 0 && (
                  <span id='image'>
                    <Upload
                      showUploadList={false}
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={(file) => {
                        return false;
                      }}
                      accept='image/jpeg, image/png, image/gif, video/*'>
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
              <SC.PreviewIMG className='position-relative'>
                {fileList[0].filetype.startsWith('video') ? (
                  <video className='w-100 h-100' controls>
                    <source src={fileList[0].image} />
                    Your browser does not support HTML video.
                  </video>
                ) : (
                  <img src={fileList[0].image} className='w-100 h-100' alt='' />
                )}
                <span
                  className='btn-delete d-flex align-items-center justify-content-center'
                  onClick={onRemoveFile}>
                  <CloseOutlined />
                </span>
              </SC.PreviewIMG>
            )}

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='mt-2 d-flex justify-content-between'>
              <div>
                <Button onClick={onResetForm}>Close</Button>
              </div>
              <div>
                <Button className='ml-3' type='primary' htmlType='submit'>
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </SC.Wrapper>
    </Modal>
  );
};

export default CreateModal;
