import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';

import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';

import { checkIsAdmin, handlerMessage, onCheckErrorApiMessage } from 'common/functions';

import administratorServices from 'services/administrator-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';
import MenuAction from 'components/fragments/MenuAction';

import { AdministratorProps, AdministratorType } from 'models/administrator.model';

const pageSize = 10;

const AccountComponent = (props: AdministratorProps) => {
  const router = useRouter();

  const { me }: any = useAppSelector(selectAuthState);
  const [page, setPage] = useState<number>(1);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onFetchDeleteAccount = async (id: string) => {
    setLoadingDelete(true);
    try {
      await administratorServices.deleteAccount(id);
      setLoadingDelete(false);
      handlerMessage('Delete success', 'success');
    } catch (error: any) {
      setLoadingDelete(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onDeleteAccount = async (id: string) => {
    await onFetchDeleteAccount(id);
    const newData = props.users?.filter((item) => item.id !== id);
    props.setUser(newData);
  };

  const columns: ColumnsType<AdministratorType> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Active',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => <StatusCheck checked={record.status} />,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) =>
        !checkIsAdmin(me.permis) ? (
          <StopOutlined />
        ) : (
          <MenuAction
            data={record}
            contentDelete={{ title: 'Are you sure delete this account?', content: record.username }}
            handleEdit={() => router.push(`/accounts/edit/${record.id}`)}
            handleDelete={() => onDeleteAccount(record.id)}
          />
        ),
    },
  ];

  return (
    <TableCustom
      loading={props.loading || loadingDelete}
      columns={columns}
      data={props.users}
      rowKey='id'
      width={800}
      isPagination={props.users && props.users?.length > pageSize}
      total={props.users?.length}
      pageSize={pageSize}
      onChangePage={(page) => setPage(page)}
    />
  );
};

export default AccountComponent;
