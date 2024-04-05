import React, { Fragment } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { urlPage } from 'common/constant';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ProductAddComponent from 'components/pages/Products/Create';

import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.products;

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Create Product</title>
      </Head>

      <HeaderPageFragment title='Create Product' breadcrumb={[{ title: 'Products', path: urlPage.productNewest }, { title: 'Create' }]} />
      <ProductAddComponent
        allowAction={{
          read: permission?.read,
          add: permission?.write,
          remove: permission?.remove,
        }}
      />
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: { openKeys: ['products'], selectedKey: 'products-create' },
  })
);
