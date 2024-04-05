import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import FaqServices from 'services/modeling-service/landing-page/faq-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import FAQsComponent from 'components/pages/ModelingService/FAQs/List';

import { FaqType } from 'models/modeling-landing-page-faq';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [faqs, setFaq] = useState<FaqType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await FaqServices.listFaq();
        if (!res.error) setFaq(res.data);

        setLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service FAQs</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service FAQs' />

        <PageContent>
          <FAQsComponent loading={loading} faqs={faqs} setFaq={setFaq} />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-landing-page'],
      selectedKey: 'modeling-service-landing-page-FAQs',
    },
  })
);
