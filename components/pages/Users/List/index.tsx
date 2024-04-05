import React from 'react';
import { useRouter } from 'next/router';

import { Button, Tabs } from 'antd';

import UserTable from './Table';

import { UserComponentType } from 'models/user.model';

import * as SC from './style';

const UserComponent = (props: UserComponentType) => {
  const router = useRouter();
  const key: string = router.query?.key?.toString() ?? '';

  const items = [
    {
      key: 'customer',
      label: 'CUSTOMER',
      children: <UserTable type='customer' allowAction={props.allowAction} />,
      isShow: true,
    },
    {
      key: 'seller',
      label: 'SELLER',
      children: <UserTable type='seller' allowAction={props.allowAction} />,
      isShow: true,
    },
    {
      key: 'showroom',
      label: 'SHOWROOM',
      children: <UserTable type='showroom' allowAction={props.allowAction} />,
      isShow: props.allowActionShowroom?.list,
    },
  ];

  return (
    <SC.Wrapper>
      {props.allowActionShowroom?.add && (
        <Button className='btn-add' type='primary' onClick={() => router.push(`/showroom/create`)}>
          Create Showroom
        </Button>
      )}
      <Tabs
        defaultActiveKey={key}
        onChange={(key: string) => router.push({ query: { key } }, undefined, { shallow: true })}
        items={items.filter((i) => i.isShow)}
      />
    </SC.Wrapper>
  );
};

export default UserComponent;
