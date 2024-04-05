import { Col, Row, Select } from 'antd';

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilterType: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const SortTypeFeedback = (props: Props) => {
  const onFilter = (value: number | string) => {
    props.setFilterType(value !== 'all' && typeof value === 'number' ? value : undefined);
  };

  return (
    <Row gutter={[20, 0]} className='mb-3'>
      <Col span={12}>
        <Select
          placeholder='Sort by'
          className='w-100'
          defaultValue='all'
          options={[
            { label: 'All', value: 'all' },
            { label: 'New', value: 1 },
            { label: 'Doing', value: 2 },
            { label: 'Done', value: 3 },
            { label: 'Reject', value: 4 },
          ]}
          onChange={(value) => {
            props.setPage(1);
            onFilter(value);
          }}
        />
      </Col>
    </Row>
  );
};
export default SortTypeFeedback;
