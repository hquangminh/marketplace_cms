import React, { Fragment } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import UserComponent from 'components/pages/Users/List';
import HeaderPageFragment from 'components/fragments/HeaderPage';

import { PropsPageType } from 'models/common.model';

const User = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.users;
  const permissionShowroom = props.auth?.user.permis.showroom;

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Account</title>
      </Head>

      <>
        <HeaderPageFragment title='Account' fullWidth />
        <UserComponent
          allowAction={{
            add: permission?.write ?? false,
            read: permission?.read ?? false,
            remove: permission?.remove ?? false,
          }}
          allowActionShowroom={{
            list: permissionShowroom?.list ?? false,
            add: permissionShowroom?.write ?? false,
            read: permissionShowroom?.read ?? false,
            remove: permissionShowroom?.remove ?? false,
          }}
        />
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(User, { sidebar: { openKeys: ['users'], selectedKey: 'users-list' } })
);
