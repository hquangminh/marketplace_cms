import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import userServices from 'services/user-services';
import ShowroomAction from 'components/pages/Users/ShowroomAction';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import { ShowroomType } from 'models/showroom.models';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const router = useRouter();

  const [showroomDetail, setShowRoomDetail] = useState<ShowroomType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userServices.getUserDetail(
          typeof router.query.showroomId === 'string' ? router.query.showroomId : ''
        );

        if (res.status === 200) setShowRoomDetail(res.data.user);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getUser();
  }, [router.query.showroomId]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Showroom Edit</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Edit Showroom'
          breadcrumb={[
            {
              title: 'Showroom',
              path: '/users?tab=showroom',
            },
            { title: 'Edit Showroom' },
          ]}
        />
        <PageContent>
          <ShowroomAction
            showroomDetail={showroomDetail}
            setShowroomDetail={setShowRoomDetail}
            loading={loading}
            type='edit'
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['brands'] } }));
