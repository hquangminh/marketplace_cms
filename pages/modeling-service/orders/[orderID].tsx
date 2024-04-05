import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import orderServices from 'services/modeling-service/order-services';
import modelingPriceServices from 'services/modeling-service/landing-page/pricing-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ModelingOrderDetail from 'components/pages/ModelingService/Orders/Detail';

import { ModelingOrderModel } from 'models/modeling-landing-page-orders';
import { PriceType } from 'models/modeling-landing-page-pricing';
import { Spin } from 'antd';

const Index = () => {
  const router = useRouter();
  const orderID = router.query.orderID?.toString();

  const [loading, setLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<ModelingOrderModel | null>(null);
  const [pricePackage, setPricePackage] = useState<PriceType[]>([]);

  const fetchOrderDetail = useCallback(async () => {
    if (orderID)
      await Promise.all([
        orderServices.getOrderDetail(orderID),
        modelingPriceServices.listPricing(),
      ])
        .then(([{ data: order }, { data: packages }]) => {
          setOrderDetail(order);
          setPricePackage(packages.filter(({ status }: PriceType) => status));
        })
        .finally(() => setLoading(false));
  }, [orderID]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Order</title>
      </Head>

      <HeaderPageFragment title='Modeling Service Order' subTitle={orderDetail?.name} />
      {loading && (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ minHeight: 500 }}>
          <Spin />
        </div>
      )}
      {orderDetail && (
        <ModelingOrderDetail
          data={orderDetail}
          pricePackage={pricePackage}
          onUpdatePackage={setPricePackage}
        />
      )}
    </>
  );
};

export default withAuth(
  withLayout(Index, {
    sidebar: {
      openKeys: ['modeling-service', 'modeling-service-order'],
      selectedKey: 'modeling-service-order',
    },
  })
);
