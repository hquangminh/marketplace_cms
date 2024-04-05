import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import { handlerMessage } from 'common/functions';

import settingsServices from 'services/settings-services';

import Settings from 'components/pages/Settings/General';

import { settingListType } from 'models/settings.model';

import { PageContent } from 'styles/__styles';

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [settingList, setSettingList] = useState<settingListType | undefined>();

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await settingsServices.getSettings();

      if (!res.error) setSettingList(res.data);
      setLoading(true);
    } catch (error) {
      handlerMessage('', 'error');
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Settings</title>
      </Head>

      <>
        <HeaderPageFragment title='Settings' addPath='/settings' />
        <PageContent>
          <Settings settingList={settingList} loading={loading} setLoading={setLoading} />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['settings'], selectedKey: 'settings-general' } })
);
