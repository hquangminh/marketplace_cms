import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import administratorServices from 'services/administrator-services';

import { handlerMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import AccountsAddComponent from 'components/pages/Accounts/Create';

import { AdministratorType } from 'models/administrator.model';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const router = useRouter();
  const { accountId }: any = router.query;

  const [loadingGetDetail, setLoadingGetDetail] = useState<boolean>(true);
  const [accountDetail, setAccountDetail] = useState<AdministratorType | any>({});

  const fetchData = async (id: string) => {
    setLoadingGetDetail(true);

    try {
      const res = await administratorServices.getAccountDetail(id);

      setAccountDetail(res.data);
      setLoadingGetDetail(false);
    } catch (error) {
      setLoadingGetDetail(false);
      handlerMessage('Notfound', 'error');
    }
  };

  useEffect(() => {
    fetchData(accountId);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Edit Account </title>
      </Head>

      <HeaderPageFragment
        title='Edit Account'
        breadcrumb={[
          { title: 'Administrators', path: '/accounts' },
          { title: accountDetail.username },
        ]}
      />
      <PageContent>
        <AccountsAddComponent
          accountId={accountId}
          accountDetail={accountDetail}
          loadingGetDetail={loadingGetDetail}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: { openKeys: ['accounts'] },
  })
);
