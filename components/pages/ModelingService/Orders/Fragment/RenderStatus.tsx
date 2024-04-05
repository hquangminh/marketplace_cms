import { Badge } from 'antd';
import { ModelingStatus } from 'models/modeling-landing-page-orders';
import styled from 'styled-components';

const RenderStatusComponent = ({ status }: { status: ModelingStatus }) => {
  const statusName: { [key: number]: string } = {
    1: 'New',
    2: 'Pending quote',
    3: 'Pending payment',
    4: 'In progress',
    5: 'In repair',
    6: 'Pending my review',
    7: 'Fulfilled',
    8: 'Canceled',
  };
  return (
    <BadgeWrapper className={`status--${status}`} status='default' text={statusName[status]} />
  );
};

const BadgeWrapper = styled(Badge)`
  &:not(.ant-badge-status-text) .ant-badge-status-dot {
    background-color: transparent;
  }
  &.status {
    &--1 .ant-badge-status-dot {
      background-color: #595959;
    }

    &--2 .ant-badge-status-dot {
      background-color: #fa8c16;
    }

    &--3 .ant-badge-status-dot {
      background-color: #faad14;
    }

    &--4 .ant-badge-status-dot {
      background-color: #52c41a;
    }

    &--5 .ant-badge-status-dot {
      background-color: #fa8c16;
    }

    &--6 .ant-badge-status-dot {
      background-color: #722ed1;
    }

    &--7 .ant-badge-status-dot {
      background-color: #1677ff;
    }

    &--8 .ant-badge-status-dot {
      background-color: #f5222d;
    }
  }
`;

export default RenderStatusComponent;
