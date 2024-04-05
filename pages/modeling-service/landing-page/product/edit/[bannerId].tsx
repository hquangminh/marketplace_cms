import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { handlerMessage } from 'common/functions';

import modelingBannerServices from 'services/modeling-banner';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BannerCreateComponent from 'components/pages/ModelingService/Banner/create';

import { BannerDetailType } from 'models/modeling-landing-page-banner';

const Index = () => {
  const router = useRouter();
  const [bannerDetail, setBannerDetail] = useState<BannerDetailType | null>(null);

  const [loading, setLoading] = useState(true);

  const bannerId = router.query?.bannerId;

  useEffect(() => {
    const onFetchBannerDetail = async () => {
      setLoading(true);
      try {
        const resp = await modelingBannerServices.getModelingBannerDetail(bannerId as string);

        if (!resp.error) {
          setBannerDetail(resp.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Not found', 'error');
      }
    };

    onFetchBannerDetail();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Product Edit</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Edit Product'
          breadcrumb={[
            {
              title: 'Modeling Service Landing Page Product',
              path: '/modeling-service/landing-page/product',
            },
            { title: 'Edit Product' },
          ]}
        />

        <BannerCreateComponent
          bannerDetail={bannerDetail}
          setBannerDetail={setBannerDetail}
          loading={loading}
          type='edit'
          page='banner-product'
          isUpdate
        />
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: [
        'modeling-service',
        'modeling-service-landing-page',
        'modeling-service-landing-page-product',
      ],
    },
  })
);
