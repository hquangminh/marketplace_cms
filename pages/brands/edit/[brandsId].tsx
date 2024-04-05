import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { handlerMessage } from 'common/functions';

import brandsServices from 'services/brands-services';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import BrandsAction from 'components/pages/Brands/BrandsAction';
import { BrandsType } from 'models/brands-model';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const router = useRouter();

  const [brandsDetail, setBrandsDetail] = useState<BrandsType | null>(null);
  const [loading, setLoading] = useState(true);

  const brandsId = router.query?.brandsId;

  useEffect(() => {
    const onFetchBrandsDetail = async () => {
      setLoading(true);
      try {
        const resp = await brandsServices.getBrandsDetail(brandsId as string);

        if (!resp.error) {
          setBrandsDetail(resp.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Not found', 'error');
      }
    };

    onFetchBrandsDetail();
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Modeling Service Pricing Edit</title>
      </Head>

      <>
        <HeaderPageFragment
          title='Edit Brands'
          breadcrumb={[
            {
              title: 'Brands',
              path: '/brands',
            },
            { title: 'Edit Brands' },
          ]}
        />
        <PageContent>
          <BrandsAction
            brandsDetail={brandsDetail}
            setBrandsDetail={setBrandsDetail}
            loading={loading}
            type='edit'
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['brands'] } }));
