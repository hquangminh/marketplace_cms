import React, { Fragment, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import productServices from 'services/product-services';

import { onCheckErrorApiMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ProductSearchComponent from 'components/pages/Products/Search';

import { PropsPageType } from 'models/common.model';
import { ProductModel } from 'models/product.model';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.products;

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductModel[] | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      let paramFilter = { ...params };

      if (Object.keys(paramFilter).length > 0) {
        paramFilter.keyword = params.title.trim();
        // Convert multi space to one space
        paramFilter.keyword = paramFilter.keyword.replace(/[\s]/gi, ' ');
        // Convert + on url to space
        paramFilter.keyword = paramFilter.keyword.replace(/\+/g, ' ');
        // Remove 2 leading spaces
        paramFilter.keyword = paramFilter.keyword.replace(/\s+/g, ' ').trim();

        delete paramFilter.title;
        // paramFilter.keyword = params.keyword
        //   .replace(/[^\w\s]/gi, ' ')
        //   .replace(/\+/g, ' ')
        //   .replace(/\s+/g, ' ')
        //   .split(' ');
        if (paramFilter.format?.length === 0) delete paramFilter.format;
        if (!paramFilter.minPrice) delete paramFilter.minPrice;
        if (!paramFilter.maxPrice) delete paramFilter.maxPrice;
        if (!paramFilter.keyword) delete paramFilter.keyword;

        if (paramFilter.sort) {
          paramFilter.sort_by = paramFilter.sort.split('_')[0];
          paramFilter.sort_type = paramFilter.sort.split('_')[1];
          delete paramFilter.sort;
        }
        paramFilter.others?.forEach((i: string) => {
          paramFilter[i] = true;
          delete paramFilter.others;
        });

        const res = await productServices.filterProducts({
          limit: pageSize,
          offset: (paramFilter.page - 1) * pageSize,
          params: { ...paramFilter },
        });
        setProducts(res.data && res.data.length > 0 ? res.data : []);
        setTotal(res.total);
      } else {
        setProducts(null);
        setTotal(0);
      }
      setLoading(false);

      return paramFilter.page;
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Search Product</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Search Products'
          isAdd={permission?.write || false}
          addPath='/products/create'
        />
        <PageContent>
          <ProductSearchComponent
            loading={loading}
            products={products}
            setProducts={setProducts}
            totalProducts={total}
            pageSize={pageSize}
            onSearch={fetchData}
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
    sidebar: { openKeys: ['products'], selectedKey: 'products-search' },
  })
);
