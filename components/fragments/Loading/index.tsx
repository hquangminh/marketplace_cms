import React from 'react';
import { Space, Spin } from 'antd';

import * as L from './style';

type Props = {
  fullPage?: boolean;
  size?: 'small' | 'default' | 'large';
  isOpacity?: boolean;
};

const Loading = ({ fullPage, size = 'default', isOpacity }: Props) => {
  return (
    <L.customLoading fullPage={fullPage} isOpacity={isOpacity}>
      <Space size='middle'>
        <Spin size={size} />
      </Space>
    </L.customLoading>
  );
};

export default Loading;
