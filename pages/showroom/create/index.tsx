import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ShowroomAction from 'components/pages/Users/ShowroomAction';

import { PageContent } from 'styles/__styles';

const Index = () => {
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Showroom Create</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Create Showroom'
          breadcrumb={[
            {
              title: 'Showroom',
              path: '/users?tab=showroom',
            },
            { title: 'Create Showroom' },
          ]}
        />
        <PageContent>
          <ShowroomAction type='create' />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['users'], selectedKey: 'showroom-create' } })
);
