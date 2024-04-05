import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import SearchComponent from 'components/pages/ModelingService/Orders/Search';

import { PageContent } from 'styles/__styles';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service - Search Order</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service - Search Order' />

        <PageContent>
          <SearchComponent />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-order'],
      selectedKey: 'modeling-service-order-search',
    },
  })
);
