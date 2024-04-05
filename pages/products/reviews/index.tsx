import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import productServices from 'services/product-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ReviewListComponent from 'components/pages/Reviews/List';

import { ProductModel } from 'models/product.model';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const [products, setProducts] = useState<ProductModel[] | null>(null);

  const fetchData = async () => {
    try {
      const res = await productServices.getProductPopular((page - 1) * pageSize, 100);

      if (!res.error) {
        setProducts(res.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Reviews</title>
      </Head>

      <HeaderPageFragment title='Reviews' addPath='/reviews' />

      <PageContent>
        <ReviewListComponent
          data={products}
          page={page}
          setPage={setPage}
          loading={loading}
          pageSize={pageSize}
        />
      </PageContent>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['products'], selectedKey: 'products-reviews' } })
);
