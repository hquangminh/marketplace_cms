import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import BannerCreateComponent from 'components/pages/ModelingService/Banner/create';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Banner Create</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Banner'
          breadcrumb={[
            {
              title: 'Modeling Service Landing Page Banner',
              path: '/modeling-service/landing-page/banner',
            },
            { title: 'Create Banner' },
          ]}
        />

        <BannerCreateComponent page='banner' />
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
        'modeling-service-landing-page-banner',
      ],
      selectedKey: 'modeling-service-landing-page-banner-create',
    },
  })
);
