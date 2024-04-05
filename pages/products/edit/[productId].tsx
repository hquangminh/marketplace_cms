import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { handlerMessage } from 'common/functions';
import { urlPage } from 'common/constant';

import productServices from 'services/product-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ProductAddComponent from 'components/pages/Products/Create';

import { ProductModel } from 'models/product.model';
import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.products;

  const router = useRouter();
  const productId: any = router.query?.productId;

  const [loadingGetDetail, setLoadingGetDetail] = useState<boolean>(true);

  const [productDetail, setProductDetail] = useState<ProductModel | null>(null);

  const fetchData = async (id: string) => {
    setLoadingGetDetail(true);

    try {
      const res = await productServices.getProductDetail(id);

      setProductDetail(res.data);
      setLoadingGetDetail(false);
    } catch (error) {
      router.push(urlPage.productNewest);
      handlerMessage('Notfound', 'error');
    }
  };

  useEffect(() => {
    fetchData(productId);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Edit Product </title>
      </Head>

      <HeaderPageFragment title='Edit Product' breadcrumb={[{ title: 'Products', path: urlPage.productNewest }, { title: productDetail?.title || '' }]} />

      <ProductAddComponent
        id={productId}
        productDetail={productDetail}
        loadingGetDetail={loadingGetDetail}
        isUpdate={true}
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
    sidebar: { openKeys: ['products'] },
  })
);
