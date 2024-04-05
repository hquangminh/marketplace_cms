import { useEffect } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';

import settingsServices from 'services/settings-services';

import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';
import { regex } from 'common/constant';

import { settingListType } from 'models/settings.model';

import Loading from 'components/fragments/Loading';

import * as L from './style';

const Settings = ({
  settingList,
  loading,
  setLoading,
}: {
  settingList: settingListType | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (settingList) {
      form.setFieldsValue(settingList);
    }
  }, [settingList]);

  const onUpdateSettings = async (parm: settingListType) => {
    setLoading(false);
    try {
      const res = await settingsServices.updateSettings(' ', parm);

      if (!res.error) handlerMessage('Update success', 'success');
      setLoading(true);
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(true);
    }
  };

  const onFinish = (values: settingListType) => {
    onUpdateSettings(values);
  };
  return (
    <L.Settings_wrapper>
      {!loading && <Loading isOpacity />}
      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={form}>
        <Row gutter={[16, 0]}>
          <Col span={24} xl={14}>
            <Form.Item
              name='facebook'
              label='Facebook'
              rules={[{ pattern: regex.url, message: 'Facebook is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='youtube'
              label='Youtube'
              rules={[{ pattern: regex.url, message: 'Youtube is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='twitter'
              label='Twitter'
              rules={[{ pattern: regex.url, message: 'Twitter is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='instagram'
              label='Instagram'
              rules={[{ pattern: regex.url, message: 'Instagram is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item name='close' label='Close'>
              <Select placeholder='Select Status'>
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item name='close_message' label='Close message'>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='fanpage'
              label='Fanpage'
              rules={[{ pattern: regex.url, message: 'Fanpage is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='behance'
              label='Behance'
              rules={[{ pattern: regex.url, message: 'Behance is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='pinterest'
              label='Pinterest'
              rules={[{ pattern: regex.url, message: 'Pinterest is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14}>
            <Form.Item
              name='artstation'
              label='Artstation'
              rules={[{ pattern: regex.url, message: 'Artstation is not a valid url' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} xl={14} className='group-btn-action-form'>
            <hr className='w-100 mt-0' />
            <Button type='primary' htmlType='submit'>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </L.Settings_wrapper>
  );
};

export default Settings;
