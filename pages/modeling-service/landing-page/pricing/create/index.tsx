import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import PricingAction from 'components/pages/ModelingService/Pricing/PricingAction';
import { PageContent } from 'styles/__styles';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Pricing Create</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Pricing'
          breadcrumb={[
            {
              title: 'Modeling Service',
            },
            {
              title: 'Landing Page',
            },
            {
              title: 'Pricing',
              path: '/modeling-service/landing-page/pricing',
            },
            { title: 'Create Pricing' },
          ]}
        />
        <PageContent>
          <PricingAction type='create' />
        </PageContent>
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
        'modeling-service-landing-page-pricing',
      ],
      selectedKey: 'modeling-service-landing-page-pricing-create',
    },
  })
);
