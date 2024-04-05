import React, { Fragment } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BlogCreateComponent from 'components/pages/Blog/Create';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Create Blog </title>
      </Head>

      <HeaderPageFragment
        title='Create Blog'
        breadcrumb={[{ title: 'Blog', path: `/blog` }, { title: 'Create' }]}
      />

      <BlogCreateComponent />
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['blog'], selectedKey: 'blog-create' } })
);
