import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BrandsAction from 'components/pages/Brands/BrandsAction';

import { PageContent } from 'styles/__styles';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Brands</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Brands'
          breadcrumb={[
            {
              title: 'Brands',
              path: '/brands',
            },
            { title: 'Create Brands' },
          ]}
        />
        <PageContent>
          <BrandsAction type='create' />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['brands'], selectedKey: 'brands-create' } })
);
