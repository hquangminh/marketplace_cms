import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { UserModel } from 'models/user.model';

import userServices from 'services/user-services';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import UserDetail from 'components/pages/Users/Detail';
import SpinComponent from 'components/fragments/SpinComponent';

import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.orders;

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserModel | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userServices.getUserDetail(
          typeof router.query.userId === 'string' ? router.query.userId : ''
        );

        if (res.status === 200) setUser(res.data.user);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getUser();
  }, [router.query.userId]);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin | {user?.name}</title>
      </Head>

      <HeaderPageFragment
        title='User Detail'
        fullWidth
        breadcrumb={[{ title: 'Users', path: '/users' }, { title: user?.name || '' }]}
      />
      {loading ? (
        <SpinComponent />
      ) : (
        <UserDetail
          loading={loading}
          user={user}
          allowAction={{
            read: permission?.read,
            add: permission?.write,
            remove: permission?.remove,
          }}
        />
      )}
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['users'] } }));
