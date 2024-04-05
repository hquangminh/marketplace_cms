import { useEffect, useState } from 'react';

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import { useWatch } from 'antd/lib/form/Form';

import { getBase64, handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import { imageSupported } from 'common/constant';
import settingsServices from 'services/settings-services';

import { Language } from 'models/settings.model';

interface Props {
  type?: 'add' | 'edit';
  data?: Language;
  /* eslint-disable no-unused-vars */
  onClose: () => void;
  onSuccess: (type: 'add' | 'edit', data: Language) => void;
}

export default function LanguageForm({ type, data, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();

  const watchLanguageDefault = useWatch('is_default', form);

  const [icon, setIcon] = useState<string | undefined>(data?.image);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (data) setIcon(data.image);
  }, [data]);

  const beforeUpload = (file: RcFile) => {
    const isSupportedType = imageSupported.includes(
      file.name.split('.').slice(-1)[0].toLowerCase()
    );
    if (!isSupportedType) message.error('This image format is not supported!');

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('Image must smaller than 2MB!');

    return isSupportedType && isLt2M ? false : Upload.LIST_IGNORE;
  };

  const normFile = (e: any) => {
    let fileList;
    if (Array.isArray(e)) fileList = e;
    else fileList = e?.fileList;
    if (fileList.length) getBase64(fileList[0].originFileObj, (base64) => setIcon(base64));
    else setIcon(undefined);
    return fileList;
  };

  const onSubmit = async (values: any) => {
    if ((!watchLanguageDefault && data?.is_default) || (data?.is_default && !values.status)) {
      handlerMessage('Please select 1 default language', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      let body = { ...values };
      delete body.icon;
      body['image'] = icon;
      if (icon && icon !== data?.image) {
        body['filetype'] = values.icon[0].type;
        body['filename'] = values.icon[0].name.replace(/\s+/g, '_');
        body['oldImage'] = data?.image;
      }

      if (type === 'add')
        await settingsServices
          .createLanguage(body)
          .then((res) => {
            onSuccess('add', { ...res.data, is_default: values.is_default });
            onClose();
            handlerMessage('Create success', 'success');
          })
          .catch((error: any) => {
            onCheckErrorApiMessage(error);
          });
      else if (data)
        await settingsServices
          .updateLanguage(data.id, body)
          .then((res) => {
            onSuccess('edit', { ...res.data, is_default: values.is_default });
            onClose();
            handlerMessage('Update success', 'success');
          })
          .catch((error: any) => {
            onCheckErrorApiMessage(error);
          });

      setSubmitting(false);
    } catch (error) {
      console.error('Add/Edit Language: ', error);
      setSubmitting(false);
    }
  };

  const modalProps: ModalProps = {
    title: (type === 'add' ? 'Add' : 'Update') + ' Language',
    visible: type !== undefined,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    closable: !submitting,
    footer: (
      <Space>
        <Button disabled={submitting} onClick={onClose}>
          Cancel
        </Button>
        <Button type='primary' loading={submitting} onClick={() => form.submit()}>
          Save
        </Button>
      </Space>
    ),
    onCancel: onClose,
    afterClose: () => {
      setIcon(undefined);
      form.resetFields();
    },
  };

  return (
    <Modal {...modalProps}>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Row gutter={[14, 0]}>
          <Col span={24}>
            <Form.Item
              name='icon'
              label='Icon'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              initialValue={data?.image ? [{ url: data.image }] : undefined}>
              <Upload
                listType='picture-card'
                maxCount={1}
                accept={imageSupported.map((i) => '.' + i).join(',')}
                showUploadList={{ showPreviewIcon: false }}
                beforeUpload={beforeUpload}>
                {!icon && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='language_name'
              label='Name'
              rules={[{ required: true }, { whitespace: true }]}
              initialValue={data?.language_name}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='language_code'
              label='Code'
              rules={[{ required: true }, { whitespace: true }]}
              initialValue={data?.language_code}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='status'
              label='Activated'
              rules={[{ required: true }]}
              initialValue={data?.status}>
              <Select
                disabled={watchLanguageDefault && type !== 'add'}
                options={[
                  { label: 'True', value: true },
                  { label: 'False', value: false },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='is_default' label='Language default' initialValue={data?.is_default}>
              <Select
                options={[
                  { label: 'True', value: true },
                  { label: 'False', value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
