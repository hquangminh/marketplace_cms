import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { handlerMessage } from 'common/functions';

import dashboardServices from 'services/dashboard';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import DashboardComponent from 'components/pages/Dashboard';

import { DashboardModel } from 'models/dashboard.model';

import { PageContent } from 'styles/__styles';

const HomePage = () => {
  const [data, setData] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await dashboardServices.getDashboard();

        if (!resp.error) {
          setData(resp.data);
          setLoading(false);
        }
      } catch (error) {
        handlerMessage('Get dashboard failed', 'error');
        setLoading(false);
      }
    })();
  }, []);
  return (
    <Fragment>
      <Head>
        <title>Market Place Admin</title>
      </Head>
      <>
        <HeaderPageFragment fullWidth title='Dashboard' />
        <PageContent noCustom>
          <DashboardComponent data={data} loading={loading} />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(withLayout(HomePage, { sidebar: { selectedKey: 'dashboard' } }));
