import React, { memo, useEffect } from 'react';

import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { regex } from 'common/constant';

import Loading from 'components/fragments/Loading';

import { LicenseModel, ParamsType } from 'models/license.models';
import { PermissionType } from 'models/auth.model';

import * as L from './style';

type Props = {
  modalLists: {
    isShow: boolean;
    data: LicenseModel | null;
    type: 'create' | 'edit' | 'view' | '';
  };
  setModalLists: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      data: LicenseModel | null;
      type: 'create' | 'edit' | 'view' | '';
    }>
  >;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onFetchCreateLicense: (body: ParamsType) => void;
  // eslint-disable-next-line no-unused-vars
  onFetchUpdateLicense: (id: string, body: ParamsType) => void;
  permis: PermissionType | undefined;
};

const ModalComponent = (props: Props) => {
  const { modalLists, setModalLists, loading, onFetchUpdateLicense, onFetchCreateLicense, permis } =
    props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (modalLists.type === 'edit' || modalLists.type === 'view') {
      form.setFieldsValue({
        title: modalLists.data?.title,
        link: modalLists.data?.link,
        description: modalLists.data?.description,
        is_free: modalLists.data?.is_free,
      });
    }
  }, [modalLists]);

  const onSubmit = (values: ParamsType) => {
    if (modalLists.type === 'edit') {
      onFetchUpdateLicense(modalLists.data?.id as string, values);
      return;
    }

    onFetchCreateLicense(values);
  };

  return (
    <Modal
      title='Create license'
      centered
      visible={modalLists.isShow}
      destroyOnClose={true}
      footer={null}
      afterClose={() => form.resetFields()}
      onCancel={() => {
        setModalLists(() => ({ isShow: false, data: null, type: 'create' }));
      }}>
      {loading && <Loading isOpacity />}
      <L.ModalComponent_wrapper>
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onFinish={onSubmit} form={form}>
          <Row gutter={[10, 0]}>
            <Col span={24}>
              <Form.Item
                name='title'
                label='Title'
                rules={[
                  { required: true, message: 'Please input title!' },
                  { whitespace: true, message: 'Title cannot be empty' },
                ]}>
                <Input placeholder='Input title' disabled={modalLists.type === 'view'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label='Link'
                name='link'
                rules={[
                  { required: true, message: 'Please input link!' },
                  { whitespace: true, message: 'Link cannot be empty' },
                  { pattern: regex.url, message: 'Link is not a valid url' },
                ]}>
                <Input placeholder='Input link' disabled={modalLists.type === 'view'} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='description'
                label='Description'
                rules={[
                  { required: true, message: 'Please input description!' },
                  { whitespace: true, message: 'Description cannot be empty' },
                ]}>
                <Input.TextArea
                  placeholder='Input description'
                  rows={5}
                  readOnly={modalLists.type === 'view'}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name='is_free' label='Is free' initialValue={true}>
                <Select disabled={modalLists.type === 'view'}>
                  <Select.Option value={true}>True</Select.Option>
                  <Select.Option value={false}>false</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <hr />
            </Col>

            <Col span={24} className='mt-2 d-flex justify-content-between'>
              <div>
                <Button
                  onClick={() => {
                    setModalLists(() => ({ isShow: false, data: null, type: 'create' }));
                  }}>
                  Close
                </Button>
              </div>
              <div>
                {modalLists.type === 'view' && permis?.license?.write && (
                  <Button
                    className='ml-3'
                    type='primary'
                    onClick={() =>
                      setModalLists((prevState) => ({
                        ...prevState,
                        type: 'edit',
                      }))
                    }>
                    Edit
                  </Button>
                )}

                {modalLists.type === 'edit' && (
                  <Button className='ml-3' type='primary' htmlType='submit'>
                    Update
                  </Button>
                )}

                {modalLists.type === 'create' && (
                  <Button className='ml-3' type='primary' htmlType='submit'>
                    Create
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </L.ModalComponent_wrapper>
    </Modal>
  );
};

export default memo(ModalComponent);
