import { useState } from 'react';
import Head from 'next/head';

import orderServices from 'services/order-services';
import { onCheckErrorApiMessage } from 'common/functions';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import OrderSearch from 'components/pages/Orders/Search';

import { PropsPageType } from 'models/common.model';
import { OrderItemType, OrderSearchParamType } from 'models/order.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.orders;

  const [loading, setLoading] = useState<boolean>(false);
  const [listOrder, setListOrder] = useState<OrderItemType[] | undefined>(undefined);

  const onSearch = async (values: OrderSearchParamType) => {
    try {
      setLoading(true);
      const res = await orderServices.searchOrder(values);

      if (!res.error) setListOrder(res.data.order);

      setLoading(false);
    } catch (error: any) {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Market Place Admin - Search Orders</title>
      </Head>

      <>
        <HeaderPageFragment title='Search orders' />
        <PageContent>
          <OrderSearch
            loading={loading}
            data={listOrder}
            onSearch={onSearch}
            onReset={() => setListOrder(undefined)}
            allowAction={{
              read: permission?.read || false,
              readUser: permission?.read || false,
              add: permission?.write || false,
              remove: permission?.remove || false,
            }}
          />
        </PageContent>
      </>
    </>
  );
};
export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['order'], selectedKey: 'orders-search' } })
);
