import { useEffect, useState } from 'react';

import { ColumnsType } from 'antd/lib/table';

import { handlerMessage } from 'common/functions';
import userServices from 'services/user-services';

import TableCustom from 'components/fragments/TableCustom';
import MenuAction from 'components/fragments/MenuAction';
import VRStylerAccountsForm from './Form';

import { UserModel } from 'models/user.model';

const pageSize = 10;

type Props = { openCreateForm: boolean; onCloseCreateForm: () => void };

const VRStylerAccountList = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<{ accounts: UserModel[]; total: number }>();
  const [dataEdit, setDataEdit] = useState<UserModel>();

  useEffect(() => {
    fetchAccountList();
  }, [page]);

  const fetchAccountList = async () => {
    setLoading(true);
    await userServices
      .getUser('4', (page - 1) * pageSize, pageSize)
      .then((res) => setData({ accounts: res.data.user, total: res.data.total }))
      .finally(() => setLoading(false));
  };

  const onResetList = () => {
    setPage(1);
    setDataEdit(undefined);
    fetchAccountList();
  };

  const onDelete = async (id: string) => {
    await userServices.delete(id).then(() => {
      handlerMessage('Delete success', 'success');
      onResetList();
    });
  };

  const columns: ColumnsType<UserModel> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <div>{index + 1 + (page - 1) * pageSize}</div>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <MenuAction
          data={record}
          handleEdit={() => setDataEdit(record)}
          handleDelete={() => onDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <TableCustom
        columns={columns}
        data={data?.accounts}
        rowKey='id'
        loading={loading}
        isPagination={data && data.total > pageSize}
        total={data?.total}
        onChangePage={setPage}
      />
      <VRStylerAccountsForm
        open={props.openCreateForm || typeof dataEdit !== 'undefined'}
        data={dataEdit}
        onClose={props.onCloseCreateForm}
        onSuccess={onResetList}
        onCancelEdit={() => setDataEdit(undefined)}
      />
    </>
  );
};

export default VRStylerAccountList;
