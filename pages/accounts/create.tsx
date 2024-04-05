import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import AccountsAddComponent from 'components/pages/Accounts/Create';

import { PageContent } from 'styles/__styles';
import administratorServices from 'services/administrator-services';
import { AdministratorType } from 'models/administrator.model';
import Loading from 'components/fragments/Loading';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUser] = useState<AdministratorType[] | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(false);
      try {
        const res = await administratorServices.getList();

        if (res.status === 200 || res.status === 202) {
          setLoading(true);
          setUser(res.user);
        } else if (res.status === 204) {
          setUser(undefined);
        }
      } catch (error) {
        setUser(undefined);
        setLoading(false);
        console.error(error);
      }
    };

    fetchUser();
  }, []);
  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Create Administrators</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Administrators'
          breadcrumb={[{ title: 'Administrators', path: '/accounts' }, { title: 'Create' }]}
        />
        <PageContent className='position-relative'>
          {!loading && <Loading isOpacity />}
          <AccountsAddComponent users={users} />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['accounts'], selectedKey: 'accounts-add' } })
);
