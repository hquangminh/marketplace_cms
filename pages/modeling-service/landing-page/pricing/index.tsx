import { useEffect, useState } from 'react';
import Head from 'next/head';

import { handlerMessage } from 'common/functions';

import modelingPriceServices from 'services/modeling-service/landing-page/pricing-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import PricingComponent from 'components/pages/ModelingService/Pricing/List';

import { PriceType } from 'models/modeling-landing-page-pricing';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [prices, setPrice] = useState<PriceType[] | null>(null);

  useEffect(() => {
    const onFetchAllPricing = async () => {
      setLoading(true);
      try {
        const resp = await modelingPriceServices.listPricing();
        if (!resp.error) {
          setLoading(false);
          setPrice(resp.data);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Modeling pricing not found', 'error');
      }
    };

    onFetchAllPricing();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Pricing</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Modeling Service Pricing'
          isAdd
          addPath='/modeling-service/landing-page/pricing/create'
        />
        <PageContent>
          <PricingComponent loading={loading} prices={prices || []} setPrice={setPrice} />
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
        'modeling-service-landing-page-pricing',
      ],
      selectedKey: 'modeling-service-landing-page-pricing-list',
    },
  })
);
