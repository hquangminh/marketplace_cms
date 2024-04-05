import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import helpServices from 'services/help-services';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { handlerMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import HelpCreateComponent from 'components/pages/Help/Create';

import { PropsPageType } from 'models/common.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.help;
  const router = useRouter();

  const helpID: string | string[] | undefined = router.query.helpId;
  const helpType: string = router.asPath.split('/')[2];

  const [loading, setLoading] = useState<boolean>(false);
  const [helpDetail, setHelpDetail] = useState<any>({});

  const fetchData = async (id: string) => {
    setLoading(true);

    try {
      const res = await helpServices.getHelpDetail(id);

      setHelpDetail(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handlerMessage('Notfound', 'error');
    }
  };

  useEffect(() => {
    if (helpID) {
      fetchData(helpID as string);
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - View Help </title>
      </Head>

      <HeaderPageFragment
        title='View Help'
        breadcrumb={[
          {
            title: 'Help',
            path: `/help`,
          },
          {
            title: 'View',
          },
        ]}
      />
      <PageContent>
        <HelpCreateComponent
          data={helpDetail}
          loading={loading}
          setLoading={setLoading}
          helpType={helpType}
          helpID={helpID}
          allowAction={{
            read: permission?.read,
            add: permission?.write,
            remove: permission?.remove,
          }}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['help'] } }));
