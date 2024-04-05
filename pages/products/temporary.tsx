import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import productServices from 'services/product-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ProductListComponent from 'components/pages/Products/List';

import { PropsPageType } from 'models/common.model';
import { ProductModel } from 'models/product.model';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.products;

  const [loading, setLoading] = useState<boolean>(true);
  const [temporaryLists, setTemporaryLists] = useState<{
    total: number;
    data: ProductModel[] | null;
  }>({
    total: 0,
    data: null,
  });
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await productServices.getProductTemporary((page - 1) * pageSize, pageSize, name);

      if (!res.error)
        setTemporaryLists({
          total: res.total,
          data: res.data,
        });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, temporaryLists.total, name]);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Product Temporary</title>
      </Head>

      <>
        <HeaderPageFragment title='List Product Temporary' addPath='/products/temporary' />
        <PageContent>
          <ProductListComponent
            setProductLists={setTemporaryLists}
            loading={loading}
            setLoading={setLoading}
            total={temporaryLists.total || 0}
            products={temporaryLists.data || []}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setName={setName}
            allowAction={{
              read: permission?.read,
              add: permission?.write,
              remove: permission?.remove,
            }}
            path='temporary'
          />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: { openKeys: ['products'], selectedKey: 'products-temporary' },
  })
);
