import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import seoServices from 'services/seo-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import SeoListComponent from 'components/pages/Seo/List';

import { SeoModel } from 'models/seo.models';
import { PropsPageType } from 'models/common.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.seo;

  const [loading, setLoading] = useState<boolean>(true);
  const [seoList, setSeoList] = useState<SeoModel[] | null>(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await seoServices.getSeoList();

      if (!res.error) setSeoList(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Seo</title>
      </Head>

      <>
        <HeaderPageFragment title='Seo' isAdd={permission?.write || false} addPath='/seo/create' />
        <PageContent>
          <SeoListComponent
            data={seoList}
            setSeoList={setSeoList}
            loading={loading}
            setLoading={setLoading}
            allowAction={{
              read: permission?.read || false,
              add: permission?.write || false,
              remove: permission?.remove || false,
            }}
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['seo'], selectedKey: 'seo-list' } })
);
