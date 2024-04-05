import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const showConfirmDelete = (
  /* eslint-disable no-unused-vars */
  id: string,
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void,
  title?: string,
  content?: string
) => {
  const confirm = Modal.confirm({
    title: title ?? 'Are you sure delete this item?',
    icon: <ExclamationCircleOutlined />,
    content: content,
    centered: true,
    maskClosable: true,
    okText: 'Yes',
    okType: 'danger',
    okButtonProps: { style: { minWidth: 70 } },
    cancelText: 'No',
    cancelButtonProps: { type: 'primary', style: { minWidth: 70 } },
    onOk: async () =>
      await Promise.all([
        confirm.update({ cancelButtonProps: { disabled: true } }),
        onDelete(id || ''),
      ]),
  });
};
