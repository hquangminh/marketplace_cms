import { Col, Form, Input, Row, Select } from 'antd';
import { NamePath } from 'antd/lib/form/interface';

import FormItemTextEditor from 'components/fragments/FormItemTextEditor';

import { BlogData } from 'models/blog.modes';

const ruleWhiteSpace = { whitespace: true, message: 'Cannot be empty' };

// eslint-disable-next-line no-unused-vars
type OnChangeContent = (name: NamePath, value: any) => void;
type Props = {
  data?: BlogData;
  languageId: string;
  isRequired: boolean;
  onChangeContent: OnChangeContent;
};

export default function BlogCreateFormLanguage(props: Props) {
  const { data, languageId, isRequired } = props;

  return (
    <Row gutter={[0, 10]}>
      <Col span={24}>
        <Form.Item
          name={'title-' + languageId}
          label='Title'
          rules={[{ required: isRequired, message: 'Title is required' }, ruleWhiteSpace]}
          initialValue={data?.title}>
          <Input placeholder='Input title' />
        </Form.Item>
      </Col>

      <Col span={24} xl={24}>
        <Form.Item
          name={'sumary-' + languageId}
          label='Summary'
          initialValue={data?.sumary}
          rules={[{ required: isRequired, message: 'Summary is required' }, ruleWhiteSpace]}>
          <Input.TextArea placeholder='Input summary' rows={3} />
        </Form.Item>
      </Col>

      <Col span={24}>
        <FormItemTextEditor
          name={'content-' + languageId}
          label='Description'
          initialValue={data?.content}
          rules={[{ required: isRequired, message: 'Content is required' }, ruleWhiteSpace]}
        />
      </Col>

      <Col span={24}>
        <Form.Item
          name={'hashtag-' + languageId}
          label='Hashtag'
          initialValue={data?.hashtag || undefined}>
          <Select
            mode='tags'
            style={{ width: '100%' }}
            open={false}
            placeholder='Please press enter to add hashtag'
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name={'seo_title-' + languageId}
          label='SEO Title'
          initialValue={data?.seo_title}
          rules={[ruleWhiteSpace]}>
          <Input placeholder='Input SEO Title' />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name={'seo_description-' + languageId}
          label='SEO Description'
          initialValue={data?.seo_description}
          rules={[ruleWhiteSpace]}>
          <Input placeholder='Input SEO Description' />
        </Form.Item>
      </Col>
    </Row>
  );
}
