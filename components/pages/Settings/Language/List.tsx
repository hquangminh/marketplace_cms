import { Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';

import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditFilled,
  DeleteFilled,
  MinusOutlined,
} from '@ant-design/icons';

import settingsServices from 'services/settings-services';
import { handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import TableCustom from 'components/fragments/TableCustom';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { Language } from 'models/settings.model';

import styled from 'styled-components';

interface Props {
  data?: Language[];
  loading: boolean;
  /* eslint-disable no-unused-vars */
  onDeleteSuccess: (id: string) => void;
  onClickEdit: (data: Language) => void;
}
export default function SettingLanguageList(props: Props) {
  const { data, loading, onDeleteSuccess, onClickEdit } = props;

  const onDelete = async (id: string) => {
    await settingsServices
      .deleteLanguage(id)
      .then(() => {
        onDeleteSuccess(id);
        handlerMessage('Delete success', 'success');
      })
      .catch((error: any) => {
        onCheckErrorApiMessage(error);
      });
  };

  const columns: ColumnsType<Language> = [
    {
      title: 'Name',
      dataIndex: 'language_name',
      key: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'image',
      key: 'icon',
      render: (value) => <img width='20' src={value} alt='' />,
    },
    {
      title: 'Code',
      dataIndex: 'language_code',
      key: 'code',
    },
    {
      title: 'Activated',
      dataIndex: 'status',
      key: 'code',
      render: (value) =>
        value ? (
          <CheckCircleTwoTone twoToneColor='#52c41a' />
        ) : (
          <CloseCircleTwoTone twoToneColor='#ff4d4f' />
        ),
      align: 'center',
    },
    {
      title: 'Default',
      dataIndex: 'is_default',
      key: 'code',
      render: (value) =>
        value ? <CheckCircleTwoTone twoToneColor='#52c41a' /> : <MinusOutlined />,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tag icon={<EditFilled />} color='processing' onClick={() => onClickEdit(record)} />
          <Tag
            icon={<DeleteFilled />}
            color='error'
            style={{
              pointerEvents: record.is_default ? 'none' : 'initial',
              opacity: record.is_default ? 0.2 : 1,
            }}
            onClick={
              record.is_default
                ? undefined
                : () =>
                    showConfirmDelete(
                      record.id,
                      onDelete,
                      'Are you sure delete this language?',
                      record.language_name
                    )
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <LanguageList>
      <TableCustom data={data} columns={columns} rowKey='id' loading={loading} />
    </LanguageList>
  );
}

const LanguageList = styled.div`
  .ant-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0;
    padding: 5px 10px;
    cursor: pointer;

    span:empty {
      display: none;
    }
  }
`;
