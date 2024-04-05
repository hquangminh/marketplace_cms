import { Tag } from 'antd';

const RenderStatusFeedbackComponent = (status: number) => {
  return (
    <>
      {status === 1 && (
        <Tag
          className='status'
          style={{ color: '#595959', borderColor: '#bfbfbf', backgroundColor: '#f5f5f5' }}>
          New
        </Tag>
      )}
      {status === 2 && (
        <Tag
          className='status'
          style={{ color: '#52c41a', borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}>
          Doing
        </Tag>
      )}
      {status === 3 && (
        <Tag
          className='status'
          style={{ color: '#1677ff', borderColor: '#91caff', backgroundColor: '#e6f4ff' }}>
          Done
        </Tag>
      )}
      {status === 4 && (
        <Tag
          className='status'
          style={{ color: '#f5222d', borderColor: '#ffa39e', backgroundColor: '#fff1f0' }}>
          Reject
        </Tag>
      )}
    </>
  );
};

export default RenderStatusFeedbackComponent;
