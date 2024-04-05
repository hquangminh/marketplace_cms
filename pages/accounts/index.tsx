import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import { AdministratorType } from 'models/administrator.model';

import administratorServices from 'services/administrator-services';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import AccountComponent from 'components/pages/Accounts/List';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<AdministratorType[] | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await administratorServices.getList();

        if (res.status === 200 || res.status === 202) {
          setUsers(res.user);
        } else if (res.status === 204) {
          setUsers(undefined);
        }

        setLoading(false);
      } catch (error) {
        setUsers(undefined);
        setLoading(false);
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Administrators</title>
      </Head>

      <>
        <HeaderPageFragment title='Administrators' isAdd addPath='/accounts/create' />
        <PageContent>
          <AccountComponent loading={loading} users={users} setUser={setUsers} />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['accounts'], selectedKey: 'accounts-list' } })
);
