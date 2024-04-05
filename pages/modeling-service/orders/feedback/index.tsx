import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { handlerMessage } from 'common/functions';

import productServices, { BodyStatusFeedback } from 'services/modeling-service/product-services';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import ListFeedbackComponent from 'components/pages/ModelingService/Orders/Feedback/List';

import { ModelingListFeedback } from 'models/modeling-landing-page-product';

import { PageContent } from 'styles/__styles';

const pageSize = 10;

const Index = () => {
  const [feedbacks, setFeedbacks] = useState<{
    total: number;
    data: ModelingListFeedback[] | null;
  }>({
    data: null,
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<number>();

  const onFetchFeedback = async (status?: number) => {
    setLoading(true);

    try {
      const resp = await productServices.getListFeedbackDetail({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        status,
      });

      if (!resp.error) {
        setFeedbacks({
          data: resp.data,
          total: resp.total,
        });

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      handlerMessage('Not found order', 'error');
    }
  };

  useEffect(() => {
    onFetchFeedback(status);
  }, [status, page]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Product - Feedback</title>
      </Head>

      <>
        <HeaderPageFragment title='Modeling Service Product - Feedback' />

        <PageContent>
          <ListFeedbackComponent
            data={feedbacks.data ?? []}
            total={feedbacks.total || 0}
            setPage={setPage}
            pageSize={pageSize}
            loading={loading}
            setFilterType={setStatus}
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
      selectedKey: 'modeling-service-order-feedback',
    },
  })
);
