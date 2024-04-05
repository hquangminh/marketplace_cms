import { useEffect, useState } from 'react';

import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { handlerMessage } from 'common/functions';

import modelingBannerServices from 'services/modeling-banner';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BannerComponent from 'components/pages/ModelingService/Banner';

import { BannerDetailType } from 'models/modeling-landing-page-banner';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [data, setData] = useState<BannerDetailType[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onFetchAllBanner = async () => {
      setLoading(true);
      try {
        const resp = await modelingBannerServices.getAllModelingBanner(true);
        if (!resp.error) {
          setLoading(false);
          setData(resp.data);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Modeling banner not found', 'error');
      }
    };

    onFetchAllBanner();
  }, []);
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Product</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Modeling Service Product'
          isAdd
          addPath='/modeling-service/landing-page/product/create'
        />

        <PageContent>
          <BannerComponent
            data={data || []}
            setData={setData}
            loading={loading}
            page='banner-product'
          />
        </PageContent>
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
      selectedKey: 'modeling-service-landing-page-product-list',
    },
  })
);
