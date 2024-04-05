import { Col, Form, Input, Row, Select } from 'antd';

import styled from 'styled-components';

type Props = {
  type?: 'view' | '';
};

const Inspect3DModelsComponent = (props: Props) => {
  const { type } = props;
  return (
    <Inspect3D_wrapper className='content'>
      <h3 className='title__line'>Inspect The 3D Models</h3>
      <Row gutter={[16, 0]}>
        <Col span={24} xl={8}>
          <Form.Item name='quads' label='Quads'>
            <Input placeholder='Enter quads' disabled={type === 'view'} />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item name='total_triangles' label='Total Triangles'>
            <Input placeholder='Enter total triangles' disabled={type === 'view'} />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item name='vertices' label='Vertices'>
            <Input placeholder='Enter total vertices' disabled={type === 'view'} />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item name='textures' label='Textures'>
            <Input placeholder='Enter total textures' disabled={type === 'view'} />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item name='materials' label='Materials'>
            <Input placeholder='Enter materials' disabled={type === 'view'} />
          </Form.Item>
        </Col>

        <Col span={24} xl={8}>
          <Form.Item name='is_uv' label='UV Layers' initialValue={false}>
            <Select placeholder='Select Status' disabled={type === 'view'}>
              <Select.Option value={true}>True</Select.Option>
              <Select.Option value={false}>False</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Inspect3D_wrapper>
  );
};

const Inspect3D_wrapper = styled.div``;

export default Inspect3DModelsComponent;
