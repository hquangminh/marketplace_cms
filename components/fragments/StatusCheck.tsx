import { CheckCircleFilled } from '@ant-design/icons';
import { theme } from 'common/constant';
import Icon from './Icons';

const StatusCheck = (props: { checked: boolean }) => {
  return props.checked ? (
    <CheckCircleFilled style={{ color: theme.primary_color }} />
  ) : (
    <Icon iconName='minus-line' color='#cccccc' />
  );
};

export default StatusCheck;
