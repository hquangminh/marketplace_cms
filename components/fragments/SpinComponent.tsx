import { Spin } from 'antd';

const SpinComponent = () => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Spin size='default' />
    </div>
  );
};

export default SpinComponent;
