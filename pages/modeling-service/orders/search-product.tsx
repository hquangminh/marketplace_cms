import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { onCheckErrorApiMessage } from 'common/functions';

import orderServices from 'services/modeling-service/order-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import SearchProductComponent from 'components/pages/ModelingService/Orders/SearchProduct';

import { ParamUploadProduct, ProductModel } from 'models/modeling-landing-page-orders';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<ParamUploadProduct>({});
  const [productList, setProductList] = useState<{ total: number; data: ProductModel[] | null }>({
    data: null,
    total: 0,
  });

  const onFetchAllProduct = async () => {
    setLoading(true);
    try {
      const resp = await orderServices.getAllProduct({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        params: filterType,
      });

      if (!resp.error) {
        setProductList({ data: resp.data, total: resp.total });
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);

      onCheckErrorApiMessage(error);
    }
  };

  useEffect(() => {
    if (filterType && Object.keys(filterType).length > 0) {
      onFetchAllProduct();
    }
  }, [filterType, page]);
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Order - Search Product</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service Order - Search Product' />

        <PageContent>
          <SearchProductComponent
            data={productList.data ?? []}
            total={productList.total ?? 0}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            loading={loading}
            setFilterType={setFilterType}
            setProductLits={setProductList}
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-order'],
      selectedKey: 'modeling-service-order-search-product',
    },
  })
);
