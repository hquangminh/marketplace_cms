import { useEffect, useState } from 'react';
import Head from 'next/head';

import { Spin } from 'antd';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { onCheckErrorApiMessage } from 'common/functions';
import productServices from 'services/product-services';

import HomepageFeaturedProduct from 'components/pages/Homepage/FeatureProducts';

import { ProductFeaturedModel } from 'models/homepage.model';

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProduct] = useState<ProductFeaturedModel[]>();

  useEffect(() => {
    fetchDataProductFeatured();
  }, []);

  const fetchDataProductFeatured = async () => {
    await productServices
      .getProductFeatured()
      .then((res) =>
        setProduct(
          res.data?.map((data: ProductFeaturedModel) => ({
            ...data,
            id: data.item_id,
            id_delete: data.id,
            image: data.market_item.image,
            title: data.market_item.title,
            isUpdate: true,
          }))
        )
      )
      .catch((err) => onCheckErrorApiMessage(err));
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Market Place Admin - Homepage</title>
      </Head>

      {!loading ? (
        <HomepageFeaturedProduct featuredProducts={products} />
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ height: '90vh' }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: { openKeys: ['homepage'], selectedKey: 'homepage-featured-products' },
  })
);
