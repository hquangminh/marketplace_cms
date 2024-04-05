import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import Category from 'components/pages/Category';

import blogServices from 'services/blog-services';

import { PropsPageType } from 'models/common.model';
import { categoryListsType } from 'models/category.model';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.blog;

  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<categoryListsType[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await blogServices.getAllCategoryBlog();
        if (!res.error && res.data) setCategory(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Category</title>
      </Head>

      <HeaderPageFragment title='Blog Category' />
      <PageContent className='p-relative'>
        <Category
          categoryLists={category}
          setCategory={setCategory}
          loading={loading}
          allowAction={{
            read: permission?.read || false,
            add: permission?.write || false,
            remove: permission?.remove || false,
          }}
          page='category-blog'
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['blog'], selectedKey: 'category-blog' } })
);
