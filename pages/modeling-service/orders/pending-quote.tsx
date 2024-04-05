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
        params: { status: 2, sort_type: 'desc_nulls_last', sort_by: 'quote_time' },
      });

      if (!resp.error) {
        setLoading(false);
        setOrderLists({
          data: resp.data,
          total: resp.total,
        });
      }
    } catch (error) {
      handlerMessage('Not found order', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchOrder();
  }, [page]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Order - Pending quote</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service Order - Pending quote' />

        <PageContent>
          <TableFragment
            data={orderLists.data ?? []}
            setOrderLists={setOrderLists}
            total={orderLists.total ?? 0}
            onChangePage={setPage}
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
      selectedKey: 'modeling-service-order-pending-quote',
    },
  })
);
