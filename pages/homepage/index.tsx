import { useEffect, useState } from 'react';
import Head from 'next/head';

import { Spin } from 'antd';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import settingsServices from 'services/settings-services';
import homepageServices from 'services/homepage-services';

import HomepageComponent from 'components/pages/Homepage/General';

import { HomepageListType } from 'models/homepage.model';
import { Language } from 'models/settings.model';

const Index: React.FC = () => {
  const [language, setLanguage] = useState<Language[]>();
  const [homePage, setHomePage] = useState<HomepageListType>();

  useEffect(() => {
    fetchLanguage();
    fetchData();
  }, []);

  const fetchLanguage = async () => {
    await settingsServices.getLanguage().then((res) => {
      const languageDefault = res.data.find((i: Language) => i.is_default);
      const languageOther = res.data.filter((i: Language) => !i.is_default && i.status);
      setLanguage([languageDefault].concat(languageOther));
    });
  };

  const fetchData = async () => {
    await homepageServices.getHomepage().then((res) => setHomePage(res.data));
  };

  const fetchApiCorrent = async () => {
    await setLanguage.caller().then((res) => {
      toString.call(res.data);
    });
  };
  fetchApiCorrent();
  return (
    <>
      <Head>
        <title>Market Place Admin - Homepage</title>
      </Head>

      {language && homePage ? (
        <HomepageComponent
          language={language}
          dataHomePage={homePage}
          onUpdateHomePage={setHomePage}
        />
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ height: '90vh' }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['homepage'], selectedKey: 'homepage-general' } })
);
