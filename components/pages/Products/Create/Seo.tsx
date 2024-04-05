import { Form, Input } from 'antd';

import styled from 'styled-components';

type Props = {
  type?: 'view' | '';
};

const SeoComponent = (props: Props) => {
  const { type } = props;
  return (
    <SeoComponent_wrapper className='content'>
      <h3 className='title__line'>SEO (Search Engine Optimization)</h3>

      <div className='inner'>
        <Form.Item name='seo_title' label='Title'>
          <Input placeholder='Input seo title' disabled={type === 'view'} />
        </Form.Item>

        <Form.Item name='seo_description' label='Meta Description'>
          <Input placeholder='Input seo description' disabled={type === 'view'} />
        </Form.Item>
      </div>
    </SeoComponent_wrapper>
  );
};

const SeoComponent_wrapper = styled.div``;

export default SeoComponent;
