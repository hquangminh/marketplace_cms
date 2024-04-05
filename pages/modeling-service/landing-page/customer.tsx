import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import customerServices from 'services/modeling-service/landing-page/customer-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import CustomerListComponent from 'components/pages/ModelingService/Customer/List';

import { CustomerType } from 'models/customer.model';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomer] = useState<CustomerType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customerServices.listCustomer();

        if (!res.error) setCustomer(res.data);

        setLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Banner</title>
      </Head>
      <>
        <HeaderPageFragment title='Modeling Service Customer' />
        <PageContent>
          <CustomerListComponent
            loading={loading}
            customers={customers}
            setCustomer={setCustomer}
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-landing-page'],
      selectedKey: 'modeling-service-landing-page-customer',
    },
  })
);
