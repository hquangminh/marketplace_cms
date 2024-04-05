import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { onCheckErrorApiMessage } from 'common/functions';

import productServices, { BodyStatusFeedback } from 'services/modeling-service/product-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import OrderUpdateFeedbackComponent from 'components/pages/ModelingService/Orders/Feedback';
import SpinComponent from 'components/fragments/SpinComponent';

import { ModelProductFeedback } from 'models/modeling-landing-page-product';

const Index = () => {
  const router = useRouter();
  const feedbackId = router.query.feedbackId?.toString();

  const [sending, setSending] = useState<boolean>(false);
  const [filter, setFilter] = useState<BodyStatusFeedback>();
  const [loading, setLoading] = useState(true);

  const [orderFeedbackDetail, setOrderFeedbackDetail] = useState<ModelProductFeedback[]>([]);

  useEffect(() => {
    const onFetchOrderFeedbackDetail = async () => {
      try {
        const resp = await productServices.getOrderFeedbackDetail(feedbackId as string);

        if (!resp.error) {
          setOrderFeedbackDetail(resp.data);
        }
        setLoading(false);
      } catch (error: any) {
        onCheckErrorApiMessage(error);
      }
    };

    onFetchOrderFeedbackDetail();
  }, [sending, filter]);

  const order = orderFeedbackDetail[0]?.modeling_product?.modeling_order;
  const product = orderFeedbackDetail[0]?.modeling_product;

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Order - Feedback</title>
      </Head>
      {loading ? (
        <SpinComponent />
      ) : (
        <>
          <HeaderPageFragment
            title={product?.name + ' - Feedback'}
            breadcrumb={[
              {
                title: 'Modeling Service',
              },
              {
                title: `Order #${order?.order_no}`,
                path: `/modeling-service/orders/view/${order?.id}`,
              },
              {
                title: 'Feedback',
                path: '/modeling-service/orders/feedback',
              },
              { title: 'Detail' },
            ]}
          />
          <OrderUpdateFeedbackComponent
            type='edit'
            orderFeedbackDetail={orderFeedbackDetail}
            setOrderFeedbackDetail={setOrderFeedbackDetail}
            feedbackId={feedbackId}
            sending={sending}
            setSending={setSending}
            setFilter={setFilter}
            filter={filter}
          />
        </>
      )}
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['modeling-service', 'modeling-service-order'] } })
);
