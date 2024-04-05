import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import stepServices from 'services/modeling-service/landing-page/step-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import StepComponent from 'components/pages/ModelingService/Step/List';

import { StepType } from 'models/modeling-landing-page-step';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [steps, setStep] = useState<StepType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await stepServices.listStep();
        if (!res.error) setStep(res.data);
        setLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Step</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service Step' />

        <PageContent>
          <StepComponent loading={loading} steps={steps} setStep={setStep} />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-landing-page'],
      selectedKey: 'modeling-service-landing-page-step',
    },
  })
);
