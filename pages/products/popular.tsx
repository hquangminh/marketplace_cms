import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { onCheckErrorApiMessage } from 'common/functions';
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
  const [productLists, setProductLists] = useState<{
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
      const res = await productServices.getProductPopular((page - 1) * pageSize, pageSize, name);
      if (!res.error) {
        setProductLists({
          total: res.total,
          data: res.data,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, name]);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Product Popular</title>
      </Head>

      <>
        <HeaderPageFragment
          title='List Product Popular'
          isAdd={permission?.write || false}
          addPath='/products/create'
        />
        <PageContent>
          <ProductListComponent
            setProductLists={setProductLists}
            loading={loading}
            total={productLists.total || 0}
            products={productLists.data || []}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setName={setName}
            allowAction={{
              read: permission?.read,
              add: permission?.write,
              remove: permission?.remove,
            }}
          />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: { openKeys: ['products'], selectedKey: 'products-popular' },
  })
);
