import { Fragment } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import Profile from 'components/pages/Profile';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Market Place Admin | Profile</title>
      </Head>

      <HeaderPageFragment
        title='Profile'
        breadcrumb={[{ title: 'Dashboard', path: '/' }, { title: 'Profile' }]}
        fullWidth
      />
      <Profile />
    </Fragment>
  );
};

export default withAuth(withLayout(Index));
