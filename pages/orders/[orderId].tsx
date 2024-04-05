import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { OrderItemType } from 'models/order.model';

import orderServices from 'services/order-services';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import OrderDetail from 'components/pages/Orders/Detail';

import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.users;

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [dataOrder, setDataOrder] = useState<OrderItemType | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.orderId && typeof router.query.orderId === 'string') {
          const res = await orderServices.getOrderDetail(router.query.orderId);
          if (!res.error) {
            let data = { ...res.data };
            data.market_items_boughts = res.data.market_items_boughts?.map((i: any) => {
              return i.market_item;
            });
            setDataOrder(data);
          }
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query.orderId]);

  return (
    <>
      <Head>
        <title>Market Place Admin {dataOrder ? '- Order #' + dataOrder.order_no : ''}</title>
      </Head>

      <>
        <HeaderPageFragment
          fullWidth
          title='Order Detail'
          breadcrumb={[
            { title: 'Orders', path: '/orders' },
            { title: dataOrder ? '#' + dataOrder.order_no : '' },
          ]}
        />

        <OrderDetail
          loading={loading}
          data={dataOrder}
          allowAction={{
            read: permission?.read,
            add: permission?.write,
            remove: permission?.remove,
          }}
        />
      </>
    </>
  );
};
export default withAuth(withLayout(Index, { sidebar: { openKeys: ['order', 'orders'] } }));
