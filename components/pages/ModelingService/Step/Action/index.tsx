import { useEffect } from 'react';
import { Button, Col, Row, Form, Modal, Input, InputNumber, Select, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

import { capitalizeFirstLetter, fromEventNormFile } from 'common/functions';
import { validationUploadFile } from 'common/constant';

import Loading from 'components/fragments/Loading';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import styled from 'styled-components';
import { ParamsType, StepActionProps } from 'models/modeling-landing-page-step';

const StepActionModal = (props: StepActionProps) => {
  const {
    modalLists,
    setModalLists,
    loading,
    onFetchEditStep,
    onFetchCreateStep,
    onFetchDeleteStep,
    form,
    fileList,
    setFileList,
  } = props;

  useEffect(() => {
    if (modalLists.type === 'edit') {
      form.setFieldsValue({
        orderid: modalLists.data?.orderid,
        image: modalLists.data?.image,
        title: modalLists.data?.title,
        description: modalLists.data?.description,
        status: modalLists.data?.status,
      });

      setFileList([
        {
          uid: '',
          image: modalLists.data?.image || '',
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [modalLists]);

  const onRemoveFile = () => {
    setFileList([]);
    form.setFieldsValue({
      image: undefined,
    });
  };

  const onSubmit = (values: ParamsType) => {
    const params: ParamsType = {
      ...values,
      image: fileList[0].image || '',
      filename: fileList[0].filename || '',
      filetype: fileList[0].filetype || '',
    };

    if (modalLists.type === 'edit') {
      onFetchEditStep(modalLists.data?.id as string, params);
      return;
    }

    onFetchCreateStep(params);
  };

  const deleteModal = () => {
    showConfirmDelete(
      modalLists.data?.id as string,
      onFetchDeleteStep,
      'Are you sure delete this item?',
      `Title: ${modalLists.data?.title}`
    );
  };

  return (
    <Modal
      title={modalLists.type ? capitalizeFirstLetter(modalLists.type) + ' step' : ''}
      centered
      visible={modalLists.isShow}
      destroyOnClose={true}
      footer={null}
      onCancel={() => setModalLists(() => ({ isShow: false, data: null, type: 'create' }))}>
      {loading && <Loading isOpacity />}
      <Form_wrapper>
        <Form
          layout='vertical'
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                name='image'
                label='Image'
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
                    accept='image/jpeg, image/png, image/gif'>
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
                name='title'
                label='Title'
                rules={[
                  { required: true, message: 'Title is required' },
                  { whitespace: true, message: 'Title cannot be empty' },
                ]}>
                <Input className='w-100' placeholder='Input title' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='description'
                label='Description'
                rules={[
                  { required: true, message: 'Description is required' },
                  { whitespace: true, message: 'Description cannot be empty' },
                ]}>
                <Input.TextArea placeholder='Input description' rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <hr />
            </Col>
            <Col span={24} className='mt-2 btn-submit'>
              <div>
                {modalLists.type === 'edit' ? (
                  <Button className='ml-3' type='primary' danger onClick={deleteModal}>
                    Delete
                  </Button>
                ) : null}
                {(modalLists.type === 'edit' || modalLists.type === 'create') && (
                  <Button className='ml-3' type='primary' htmlType='submit'>
                    Submit
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Form_wrapper>
    </Modal>
  );
};

const Form_wrapper = styled.div`
  position: relative;
  .sort_number {
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
`;

export default StepActionModal;
