import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { handlerMessage } from 'common/functions';

import modelingPriceServices from 'services/modeling-service/landing-page/pricing-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import PricingAction from 'components/pages/ModelingService/Pricing/PricingAction';

import { PriceType } from 'models/modeling-landing-page-pricing';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const router = useRouter();
  const [pricingDetail, setPricingDetail] = useState<PriceType | null>(null);

  const [loading, setLoading] = useState(true);

  const pricingId = router.query?.pricingId;

  useEffect(() => {
    const onFetchPricingDetail = async () => {
      setLoading(true);
      try {
        const resp = await modelingPriceServices.getPricingDetail(pricingId as string);

        if (!resp.error) {
          setPricingDetail(resp.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Not found', 'error');
      }
    };

    onFetchPricingDetail();
  }, []);
  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Pricing Edit</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Edit Pricing'
          breadcrumb={[
            {
              title: 'Modeling Service',
            },
            {
              title: 'Landing Page',
            },
            {
              title: 'Pricing',
              path: '/modeling-service/landing-page/pricing',
            },
            { title: 'Edit Pricing' },
          ]}
        />
        <PageContent>
          <PricingAction
            pricingDetail={pricingDetail}
            setPricingDetail={setPricingDetail}
            loading={loading}
            type='edit'
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
        'modeling-service-landing-page-pricing',
      ],
    },
  })
);
