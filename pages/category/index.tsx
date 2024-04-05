import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import categoryServices from 'services/category-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import Category from 'components/pages/Category';

import { PropsPageType } from 'models/common.model';
import { categoryListsType } from 'models/category.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.category;

  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<categoryListsType[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await categoryServices.getAllCategory();

        if (!res.error) {
          setCategory(res.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Category</title>
      </Head>

      <HeaderPageFragment title='Product Category' />
      <PageContent className='p-relative'>
        <Category
          categoryLists={category}
          setCategory={setCategory}
          loading={loading}
          allowAction={{
            add: permission?.write || false,
            read: permission?.read || false,
            remove: permission?.remove || false,
          }}
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'category' } }));
