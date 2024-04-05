import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Modal, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { MailOutlined, EditFilled } from '@ant-design/icons';

import { theme } from 'common/constant';
import { handlerMessage, onCheckErrorApiMessage, onToastNoPermission } from 'common/functions';

import showroomServices from 'services/showroom-services';
import userServices from 'services/user-services';

import TableCustom from 'components/fragments/TableCustom';
import StatusCheck from 'components/fragments/StatusCheck';
import MyImage from 'components/fragments/Image';

import { PageAllowActionType } from 'models/common.model';
import { UserModel } from 'models/user.model';

const pageSize = 10;

interface Props {
  type: 'customer' | 'seller' | 'showroom';
  allowAction?: PageAllowActionType;
}

const UserTable = ({ type, allowAction }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<{ list: UserModel[]; total: number }>({ list: [], total: 0 });

  const userType = useMemo(() => {
    switch (type) {
      case 'customer':
        return 1;
      case 'seller':
        return 2;
      case 'showroom':
        return 3;
      default:
        return 0;
    }
  }, [type]);

  useEffect(() => {
    fetchAccountList(page);
  }, [page, userType]);

  const fetchAccountList = async (page: number) => {
    setLoading(true);
    await userServices
      .getUser(userType.toString(), (page - 1) * pageSize, pageSize)
      .then((res) => setData({ list: res.data.user, total: res.data.total }))
      .finally(() => setLoading(false));
  };

  const handelConfirmLock = async (data: UserModel) => {
    const type = data.locked ? 'unlock' : 'lock';

    return Modal.confirm({
      title: `Are you sure you want to ${type} this user?`,
      content: (
        <>
          User: <strong>{data.name}</strong>
        </>
      ),
      centered: true,
      okText: type.slice(0, 1).toLocaleUpperCase() + type.slice(1),
      onOk: async () =>
        await userServices
          .updateUser(data.id, { locked: !data.locked })
          .then(() =>
            setData((current) => ({
              ...current,
              list: current.list.map((i) => ({
                ...i,
                locked: i.id === data.id ? !data.locked : i.locked,
              })),
            }))
          )
          .catch((error) => {
            onCheckErrorApiMessage(error);
          }),
    });
  };

  const onSendMail = async (id: string, data: UserModel) => {
    return Modal.confirm({
      title: `Are you sure want to send email this user?`,
      centered: true,
      onOk: async () => {
        await showroomServices
          .sendMail(id)
          .then(() => {
            setData((current) => ({
              ...current,
              list: current.list.map((i) => ({
                ...i,
                status: i.id === data.id ? !data.status : i.status,
              })),
              total: current.total,
            }));
            handlerMessage('Send Email success', 'success');
          })
          .catch((error) => onCheckErrorApiMessage(error, 'Showroom is active'));
      },
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
      render: (text, record) =>
        allowAction?.read ? (
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
      title: 'Logo',
      dataIndex: 'image',
      key: 'image',
      className: type === 'showroom' ? '' : 'hide',
      align: 'center',
      render: (url) => (
        <MyImage
          className='showroom_logo'
          src={url}
          imgErr='/static/images/avatar-default.png'
          alt=''
        />
      ),
    },
    {
      title: 'Active',
      dataIndex: 'locked',
      key: 'locked',
      align: 'center',
      render: (_, record) => <StatusCheck checked={!record.locked} />,
    },
    {
      title: 'Edit & Send Mail',
      key: 'action',
      className: type === 'showroom' ? '' : 'hide',
      align: 'center',
      render: (_, record) =>
        !record.status && (
          <Space>
            <Tag
              icon={<EditFilled />}
              color='processing'
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`showroom/edit/${record.id}`)}
            />{' '}
            <MailOutlined onClick={() => onSendMail(record.id, record)} />
          </Space>
        ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Tag
          style={{ minWidth: '80px', cursor: 'pointer' }}
          color={record.locked ? 'success' : 'error'}
          onClick={() => handelConfirmLock(record)}>
          {!record.locked ? 'Lock' : 'Unlock'}
        </Tag>
      ),
      className: !allowAction?.add ? 'hide' : '',
    },
  ];

  return (
    <TableCustom
      loading={loading}
      columns={columns.filter((i) => i.className !== 'hide')}
      data={data.list}
      rowKey='id'
      width={800}
      isPagination={data.total > pageSize}
      total={data.total}
      pageSize={pageSize}
      onChangePage={(page) => setPage(page)}
    />
  );
};

export default UserTable;
