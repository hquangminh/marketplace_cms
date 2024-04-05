import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import BannerCreateComponent from 'components/pages/ModelingService/Banner/create';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Product Create</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Product'
          breadcrumb={[
            {
              title: 'Modeling Service Landing Page Product',
              path: '/modeling-service/landing-page/product',
            },
            { title: 'Create Product' },
          ]}
        />

        <BannerCreateComponent page='banner-product' />
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: [
        'modeling-service',
        'modeling-service-landing-page',
        'modeling-service-landing-page-product',
      ],
      selectedKey: 'modeling-service-landing-page-product-create',
    },
  })
);
