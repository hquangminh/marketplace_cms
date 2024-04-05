import React, { Fragment } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import UserSearchComponent from 'components/pages/Users/Search';

import { PropsPageType } from 'models/common.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.users;

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Search Users</title>
      </Head>

      <>
        <HeaderPageFragment title='Search Users' />
        <PageContent>
          <UserSearchComponent
            allowAction={{
              add: permission?.write ?? false,
              read: permission?.read ?? false,
              remove: permission?.remove ?? false,
            }}
          />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['users'], selectedKey: 'users-search' } })
);
