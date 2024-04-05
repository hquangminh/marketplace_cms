import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import Category from 'components/pages/Category';

import { PropsPageType } from 'models/common.model';
import { categoryListsType } from 'models/category.model';

import { PageContent } from 'styles/__styles';
import helpServices from 'services/help-services';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.help;

  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<categoryListsType[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const resp = await helpServices.getAllHelpCategory();

        if (!resp.error) {
          if (resp.data) {
            setCategory(resp.data);
          }
          setLoading(resp.data.length === 0);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Help Category</title>
      </Head>

      <HeaderPageFragment title='Help Category' />
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
          page='help-category'
        />
      </PageContent>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['help'], selectedKey: 'help-category' } })
);
