import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { onCheckErrorApiMessage } from 'common/functions';
import withdrawServices, { BodyFilterWithdraw } from 'services/withdraw-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import WithDrawListComponent from 'components/pages/Withdraw/List';

import { WithdrawModel } from 'models/withdraw.model';

import { PageContent } from 'styles/__styles';

const Index: React.FC = () => {
  const pageSize = 10;

  const [withdraws, setWithdraw] = useState<{ dataRender: WithdrawModel[]; total: number }>({
    dataRender: [],
    total: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<BodyFilterWithdraw & { page: number }>({ page: 1 });

  const fetchData = async () => {
    setLoading(true);
    try {
      let param: BodyFilterWithdraw = {};
      if (filter.status) param['status'] = filter.status;
      if (filter.start_date) param['start_date'] = filter.start_date;
      if (filter.end_date) param['end_date'] = filter.end_date;
      const resp = await withdrawServices.postListWithdraw(
        pageSize,
        (filter.page - 1) * pageSize,
        param
      );
      if (!resp.error) {
        setWithdraw({
          total: resp.total,
          dataRender: resp.data,
        });
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filter]);

  const onUpdate = (withDrawId: string, withdraw: WithdrawModel) => {
    let withRawList = withdraws?.dataRender ? [...withdraws?.dataRender] : [];
    withRawList.splice(
      withRawList.findIndex((i) => i.id === withDrawId),
      1,
      withdraw
    );
    setWithdraw((withdraw) => ({ ...withdraw, dataRender: withRawList }));
  };

  return (
    <>
      <Head>
        <title>Market Place Admin - Withdraw</title>
      </Head>
      <HeaderPageFragment title='Withdraw' addPath='/withdraw' />
      <PageContent className='positon-relative'>
        <WithDrawListComponent
          filter={filter}
          withdraws={withdraws?.dataRender}
          setData={setWithdraw}
          loading={loading}
          setLoading={setLoading}
          page={filter.page}
          pageSize={pageSize}
          total={withdraws?.total}
          onUpdate={onUpdate}
          onChangeFilter={setFilter}
        />
      </PageContent>
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'withdraw' } }));
