import { Fragment } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import MediaComponent from 'components/pages/Media';

import { PropsPageType } from 'models/common.model';

const Media = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.media;

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin | Media</title>
      </Head>

      <HeaderPageFragment title='Media' fullWidth />
      <MediaComponent
        allowAction={{
          read: permission?.read,
          add: permission?.write,
          remove: permission?.remove,
        }}
      />
    </Fragment>
  );
};

export default withAuth(withLayout(Media, { sidebar: { selectedKey: 'media' } }));
