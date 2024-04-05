import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import blogServices from 'services/blog-services';

import { handlerMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import BlogCreateComponent from 'components/pages/Blog/Create';

const Index = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [blogDetail, setBlogDetail] = useState<any>({});

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await blogServices.getBlogDetail(id);
      if (data) setBlogDetail(data);
      setLoading(false);
    } catch (error) {
      setBlogDetail(false);
      handlerMessage('Notfound', 'error');
    }
  };

  useEffect(() => {
    const blogID: string | string[] | undefined = router.query.blogId;
    if (blogID) fetchData(blogID as string);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Edit Blog </title>
      </Head>

      <HeaderPageFragment
        title='Edit Blog'
        breadcrumb={[{ title: 'Blog', path: `/blog` }, { title: 'Blog' }]}
      />

      <BlogCreateComponent data={blogDetail} loading={loading} />
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['blog'] } }));
