import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import bannerServices from 'services/banner-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BannerComponent from 'components/pages/Banner';

import { BannerModel } from 'models/banner.model';
import { PropsPageType } from 'models/common.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.banner;

  const [loading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<BannerModel[] | null>(null);

  const onFetchBanner = async () => {
    setLoading(true);
    try {
      const resp = await bannerServices.getBanner();

      if (!resp.error) {
        setBanner(resp.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchBanner();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin</title>
      </Head>

      <HeaderPageFragment title='Banner' />

      <PageContent>
        <BannerComponent
          data={banner || []}
          allowAction={{
            read: permission?.read,
            add: permission?.write,
            remove: permission?.remove,
          }}
          setData={setBanner}
          total={banner?.length || 0}
          loading={loading}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'banner' } }));
