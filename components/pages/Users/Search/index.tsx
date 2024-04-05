import React, { Fragment, useState } from 'react';

import Link from 'next/link';

import moment from 'moment';
import { Modal, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import { theme, userType } from 'common/constant';
import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';
import userServices from 'services/user-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';

import { BodyUserSearchType, UserComponentType, UserModel } from 'models/user.model';
import { SearchModel } from 'models/table.model';

const pageSize = 10;

const UserSearchComponent = (props: UserComponentType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserModel[] | undefined>(undefined);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [valueSearch, setValueSearch] = useState<BodyUserSearchType>({
    email: '',
    dates: ['', ''],
  });

  const onSearchUser = async (body: { email?: string; start?: string; end?: string }) => {
    try {
      setLoading(true);

      const res = await userServices.searchUser(body);

      if (res.status === 200 || res.status === 202) {
        setUsers(res.data.user);
        setTotalUser(res.data.user.length);
      } else if (res.status === 204) {
        setUsers([]);
        setTotalUser(0);
      }

      setLoading(false);
    } catch (error: any) {
      setUsers(undefined);
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  const onFetchUpdateUser = async (id: string, locked: boolean, name: string) => {
    const type = !locked ? 'unlock' : 'lock';
    Modal.confirm({
      title: `Are you sure you want to ${type} this user?`,
      content: (
        <>
          User: <strong>{name}</strong>
        </>
      ),
      centered: true,
      okText: type.slice(0, 1).toLocaleUpperCase() + type.slice(1),
      onOk: async () =>
        await userServices
          .updateUser(id, { locked })
          .then(() => {
            const newData = users?.map((user) => {
              if (user.id === id) return { ...user, locked };
              return user;
            });
            setUsers(newData);
          })
          .catch((error: any) => {
            onCheckErrorApiMessage(error);
          }),
    });
  };

  const onChangeSearch = (key: any, value: any) => {
    setValueSearch((s) => ({ ...s, [key]: value }));
  };

  const onChangeActive = (status: boolean, id: string, name: string) => {
    onFetchUpdateUser(id, status, name);
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
      render: (text, record) =>
        props.allowAction?.read ? (
          <Link href={'/users/' + record.id}>
            <a style={{ color: theme.primary_color }}>{text}</a>
          </Link>
        ) : (
          <p
            onClick={onToastNoPermission}
            style={{ color: theme.primary_color, cursor: 'pointer' }}>
            {text}
          </p>
        ),
    },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (value) => {
        const accType = userType.find((i) => i.key === value);
        return (
          <Tag color={accType?.color} style={{ border: 'none', minWidth: 80, textAlign: 'center' }}>
            {accType?.title}
          </Tag>
        );
      },
    },
    {
      title: 'Total orders',
      dataIndex: 'market_orders_aggregate',
      key: 'market_orders_aggregate',
      align: 'right',
      render: (text, record) => record.market_orders_aggregate.aggregate.count,
    },
    {
      title: 'Active',
      dataIndex: 'locked',
      key: 'locked',
      align: 'center',
      render: (text, record) => <StatusCheck checked={!record.locked} />,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) =>
        props.allowAction?.add ? (
          <Tag
            style={{ minWidth: '80px', cursor: 'pointer' }}
            color={record.locked ? 'success' : 'error'}
            onClick={() => onChangeActive(!record.locked, record.id, record.name)}>
            {!record.locked ? 'Lock' : 'Unlock'}
          </Tag>
        ) : (
          <Tag style={{ minWidth: '80px' }} color={record.locked ? 'success' : 'error'}>
            {!record.locked ? 'Lock' : 'Unlock'}
          </Tag>
        ),
    },
  ];

  const searchColumn: Array<SearchModel> = [
    {
      key: 'email',
      title: 'Name / Email',
      placeholder: 'Please enter Name / Email',
      type: 'input',
      value: valueSearch.email,
      width: { xl: 12, span: 24 },
      onChange: onChangeSearch,
    },
    {
      key: 'dates',
      title: 'Register Date',
      type: 'range-picker',
      blockDateFuture: true,
      value: valueSearch.dates,
      width: { xl: 12, span: 24 },
      onChange: onChangeSearch,
    },
  ];

  const onSearch = () => {
    try {
      if (!valueSearch.email && !valueSearch.dates[0] && !valueSearch.dates[1]) {
        handlerMessage('Please enter Name or Email or select Register Date', 'warning');
        return;
      }

      let bodySearch: { email?: string; start?: string; end?: string } = {
        email: '',
        start: '',
        end: '',
      };
      bodySearch.email = valueSearch.email ? valueSearch.email.trim() : undefined;
      if (valueSearch.dates) {
        bodySearch.start = valueSearch.dates[0] ? moment(valueSearch.dates[0]).format() : undefined;
        bodySearch.end = valueSearch.dates[1] ? moment(valueSearch.dates[1]).format() : undefined;
      }

      onSearchUser(bodySearch);
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    }
  };

  const onReset = () => {
    setValueSearch((v) => ({ ...v, email: '', dates: ['', ''] }));
    setUsers(undefined);
    setTotalUser(0);
  };

  return (
    <Fragment>
      <TableCustom
        loading={loading}
        columns={columns}
        data={users}
        rowKey='id'
        width={800}
        searchColumn={searchColumn}
        isPagination={totalUser > pageSize}
        total={totalUser}
        pageSize={pageSize}
        onChangePage={setPage}
        onSearch={onSearch}
        onReset={onReset}
      />
    </Fragment>
  );
};

export default UserSearchComponent;
