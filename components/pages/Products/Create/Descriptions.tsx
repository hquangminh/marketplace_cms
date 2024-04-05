import { Form, Select } from 'antd';

import TextEditor from 'components/fragments/TextEditor';

import { DescriptionComponentProps } from 'models/product.model';
import styled from 'styled-components';

const DescriptionComponent = ({ onChangeEditor, valueEditor, type }: DescriptionComponentProps) => {
  const descriptionSample = [
    {
      title: 'Example 1',
      content: '<h1>Example 1</h1><p>Content 1</p><div><p>Author 1</p></div>',
    },
    {
      title: 'Example 2',
      content: '<h1>Example 2</h1><p>Content 2</p><div><p>Author 2</p></div>',
    },
    {
      title: 'Example 3',
      content: '<h1>Example 3</h1><p>Content 3</p><div><p>Author 3</p></div>',
    },
  ];

  const handleChange = (value: any, option: any) => {
    onChangeEditor(option?.label || '');
  };

  return (
    <Descriptions_wrapper className='content'>
      <h3 className='title__line'>Descriptions</h3>
      <Form.Item label='Sample descriptions '>
        <Select
          allowClear
          placeholder='Select sample descriptions'
          className='select'
          disabled={type === 'view'}
          onChange={handleChange}>
          {descriptionSample.map((item, index) => (
            <Select.Option key={index} value={item.title} label={item.content}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <div className='mb-4' />
      <TextEditor
        height={350}
        valueEditor={valueEditor}
        onChangeEditor={onChangeEditor}
        isDisableEditor={type === 'view'}
      />
    </Descriptions_wrapper>
  );
};

const Descriptions_wrapper = styled.div`
  .select {
    width: 250px;
  }
`;

export default DescriptionComponent;
