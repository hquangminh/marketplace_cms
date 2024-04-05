import React, { Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import HelpCreateComponent from 'components/pages/Help/Create';

import { PageContent } from 'styles/__styles';
import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.help;

  const router = useRouter();
  const helpType: string = router.asPath.split('/')[2];

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Create Help </title>
      </Head>

      <HeaderPageFragment
        title='Create Help'
        breadcrumb={[
          {
            title: 'Help',
            path: `/help`,
          },
          {
            title: 'Create',
          },
        ]}
      />
      <PageContent>
        <HelpCreateComponent
          helpType={helpType}
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

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['help'], selectedKey: 'help-create' } })
);
