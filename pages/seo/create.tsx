import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import settingsServices from 'services/settings-services';

import SeoFormCreate from 'components/pages/Seo/Create';

import { Language } from 'models/settings.model';
import { Spin } from 'antd';

const Index = () => {
  const [language, setLanguage] = useState<Language[]>();

  useEffect(() => {
    fetchLanguage();
  }, []);

  const fetchLanguage = async () => {
    await settingsServices.getLanguage().then((res) => {
      const languageDefault = res.data.find((i: Language) => i.is_default);
      const languageOther = res.data.filter((i: Language) => !i.is_default && i.status);
      setLanguage([languageDefault].concat(languageOther));
    });
  };

  return (
    <>
      <Head>
        <title>Market Place Admin - Seo Create</title>
      </Head>
      {language?.length ? (
        <SeoFormCreate language={language} />
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
  withLayout(Index, { sidebar: { openKeys: ['seo'], selectedKey: 'seo-add' } })
);
