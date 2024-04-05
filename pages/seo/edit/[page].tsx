import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Spin } from 'antd';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import settingsServices from 'services/settings-services';
import seoServices from 'services/seo-services';

import SeoFormCreate from 'components/pages/Seo/Create';

import { Language } from 'models/settings.model';
import { SeoModel } from 'models/seo.models';

const Index = () => {
  const { query } = useRouter();

  const [language, setLanguage] = useState<Language[]>();
  const [data, setData] = useState<SeoModel>();

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
    await seoServices.getSeo(query.page?.toString() || '').then((res) => setData(res.data));
  };

  return (
    <>
      <Head>
        <title>Market Place Admin - Seo Create</title>
      </Head>
      {language?.length && data ? (
        <SeoFormCreate language={language} data={data} />
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ height: 'calc(100vh - 51px)' }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['seo'] } }));
