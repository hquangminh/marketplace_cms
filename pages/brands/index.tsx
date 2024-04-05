import { useEffect, useState } from 'react';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import { handlerMessage } from 'common/functions';

import brandsServices, { BodyBrands } from 'services/brands-services';
import HeaderPageFragment from 'components/fragments/HeaderPage';
import BrandComponent from 'components/pages/Brands';
import { BrandsType } from 'models/brands-model';

import { PageContent } from 'styles/__styles';

const Index = () => {
  const pageSize = 10;

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState<{
    dataRender: BrandsType[];
    total: number;
  }>({ dataRender: [], total: 0 });

  useEffect(() => {
    const onFetchAllBrands = async () => {
      setLoading(true);
      try {
        let param: BodyBrands = {};
        const resp = await brandsServices.listBrands({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          params: param,
        });
        if (!resp.error) {
          setBrands({
            total: resp.total,
            dataRender: resp.data,
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        handlerMessage('Brands not found', 'error');
      }
    };

    onFetchAllBrands();
  }, [page]);

  return (
    <>
      <Head>
        <title>Market Place Admin - Brands</title>
      </Head>
      <>
        <HeaderPageFragment title='Brands' />
        <PageContent>
          <BrandComponent
            brands={brands.dataRender || []}
            setBrands={setBrands}
            total={brands.total || 0}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            loading={loading}
            setLoading={setLoading}
          />
        </PageContent>
      </>
    </>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['brands'], selectedKey: 'brands-list' } })
);
