import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { handlerMessage } from 'common/functions';

import orderServices from 'services/modeling-service/order-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import TableFragment from 'components/pages/ModelingService/Orders/TableFragment';

import { ModelingOrderModel } from 'models/modeling-landing-page-orders';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index = () => {
  const [orderLists, setOrderLists] = useState<{ total: number; data: ModelingOrderModel[] }>({
    data: [],
    total: 0,
  });

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const onFetchOrder = async () => {
    setLoading(true);

    try {
      const resp = await orderServices.getAllOrders({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        params: { sort_type: 'desc', sort_by: 'createdAt' },
      });

      if (!resp.error) {
        setOrderLists({ data: resp.data, total: resp.total });

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      handlerMessage('Not found order', 'error');
    }
  };

  useEffect(() => {
    onFetchOrder();
  }, [page]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Order - All</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service Order - All' />

        <PageContent>
          <TableFragment
            data={orderLists.data ?? []}
            total={orderLists.total || 0}
            onChangePage={setPage}
            setOrderLists={setOrderLists}
            pageSize={pageSize}
            loading={loading}
            onFetchOrder={onFetchOrder}
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
      selectedKey: 'modeling-service-order-all',
    },
  })
);
