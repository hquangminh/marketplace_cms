import { ReactNode } from 'react';

import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import styled from 'styled-components';

const UploadModelSection = (props: { title: string; tooltip?: ReactNode; children: ReactNode }) => {
  const { title, tooltip, children } = props;
  return (
    <Wrapper>
      <h4>
        {title}
        {tooltip && (
          <Tooltip
            className='title-tooltip'
            title={tooltip}
            placement='right'
            getPopupContainer={(elm) => elm}>
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        )}
      </h4>
      <div>{children}</div>
    </Wrapper>
  );
};

export default UploadModelSection;

const Wrapper = styled.main`
  & > h4 {
    display: flex;
    align-items: center;
    gap: 6px;

    font-size: 18px;
    font-weight: 500;
    color: var(--text-title);
    border-bottom: var(--border-1px);

    .title-tooltip {
      font-size: 18px;
      color: var(--color-icon);
    }
  }

  & > div {
    margin-top: 15px;
  }
`;
