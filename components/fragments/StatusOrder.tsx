import React from 'react';

import { Tag } from 'antd';
import { OrderStatus } from 'common/constant';

const StatusOrder = (props: { status: number; type?: 'tag' | 'text' }) => {
  const renderTag = () => {
    // prettier-ignore
    const style: React.CSSProperties = { minWidth: 80, marginRight: 0, textAlign: 'center' };
    // prettier-ignore
    switch (props.status) {
      case 1:
        return <Tag style={style} color='success'>{OrderStatus[1]}</Tag>;
      case 2:
        return <Tag style={style} color='processing'>{OrderStatus[2]}</Tag>;
      case 3:
        return <Tag style={style} color='default'>{OrderStatus[3]}</Tag>;
      case 4:
        return <Tag style={style} color='orange'>{OrderStatus[4]}</Tag>;
      case 5:
        return <Tag style={style} color='error'>{OrderStatus[5]}</Tag>;
      case 6:
        return <Tag style={style} color='cyan'>{OrderStatus[6]}</Tag>;
      default:
        return <></>
    }
  };

  const renderText = () => {
    switch (props.status) {
      case 1:
        return <>{OrderStatus[1]}</>;
      case 2:
        return <>{OrderStatus[2]}</>;
      case 3:
        return <>{OrderStatus[3]}</>;
      case 4:
        return <>{OrderStatus[4]}</>;
      case 5:
        return <>{OrderStatus[5]}</>;
      case 6:
        return <>{OrderStatus[6]}</>;
      default:
        return <></>;
    }
  };

  return props.type === 'text' ? renderText() : renderTag();
};

export default StatusOrder;
