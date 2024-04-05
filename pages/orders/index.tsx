import { useEffect, useState } from 'react';
import Head from 'next/head';

import moment from 'moment';

import { OrderItemType } from 'models/order.model';

import orderServices from 'services/order-services';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import OrderNewest from 'components/pages/Orders/Newest';

import { PropsPageType } from 'models/common.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.orders;
  const permissionUsers = props.auth?.user.permis.users;

  const [loading, setLoading] = useState<boolean>(true);
  const [listOrder, setListOrder] = useState<OrderItemType[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orderServices.getOrderNewest(
          moment(Date.now() - 30 * 24 * 60 * 60 * 1000).format()
        );

        if (!res.error && res.data.order) setListOrder(res.data.order);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Orders</title>
      </Head>

      <>
        <HeaderPageFragment title='Newest orders' />
        <PageContent>
          <OrderNewest
            loading={loading}
            data={listOrder}
            allowAction={{
              read: permission?.read || false,
              readUser: permissionUsers?.read || false,
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
  withLayout(Index, { sidebar: { openKeys: ['order'], selectedKey: 'orders-newest' } })
);
