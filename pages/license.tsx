import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import licenseServices from 'services/license-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import LicenseComponent from 'components/pages/License';

import { PropsPageType } from 'models/common.model';

import { LicenseModel } from 'models/license.models';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [license, setLicense] = useState<LicenseModel[] | null>(null);

  const onFetchBanner = async () => {
    setLoading(true);
    try {
      const resp = await licenseServices.getAllLicense();

      if (!resp.error) {
        setLicense(resp.data);
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

      <HeaderPageFragment title='License' />

      <PageContent>
        <LicenseComponent
          data={license || []}
          permis={props.auth?.user.permis}
          setData={setLicense}
          total={license?.length || 0}
          loading={loading}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'license' } }));
