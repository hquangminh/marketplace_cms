import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import helpServices from 'services/help-services';
import { onCheckErrorApiMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import HelpComponent from 'components/pages/Help';

import { PropsPageType } from 'models/common.model';
import { DataHelpType } from 'models/help-model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.help;

  const [help, setHelp] = useState<DataHelpType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterList, setFilterList] = useState<{ title?: string; category?: string }>({});
  const [listCategoryDisable, setListCategoryDisable] = useState<string[]>([]);

  const fetchHelp = async () => {
    setLoading(true);
    const body = {
      title: filterList.title,
      category: filterList.category,
    };

    try {
      const resp: { error: boolean; data: DataHelpType[] } = await helpServices.getHelp(body);

      if (!resp.error) {
        setHelp(resp.data);
        const listCategoryStatus = resp.data
          ?.filter((f) => !f.market_category_help?.status)
          .map((m) => m.id);
        setListCategoryDisable(listCategoryStatus);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      onCheckErrorApiMessage(error);
    }
  };

  useEffect(() => {
    fetchHelp();
  }, [filterList]);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Help </title>
      </Head>
      <>
        <HeaderPageFragment title='Help' isAdd={permission?.read || false} addPath='/help/create' />

        <HelpComponent
          loading={loading}
          data={help}
          setLoading={setLoading}
          setData={setHelp}
          setFilterList={setFilterList}
          allowAction={{
            read: permission?.read,
            add: permission?.write,
            remove: permission?.remove,
          }}
          listCategoryDisable={listCategoryDisable}
        />
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['help'], selectedKey: 'help-list' } })
);
