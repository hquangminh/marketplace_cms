import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import blogServices from 'services/blog-services';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import { handlerMessage } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import BlogListComponent from 'components/pages/Blog';

import { PropsPageType } from 'models/common.model';
import { BlogData } from 'models/blog.modes';

import { PageContent } from 'styles/__styles';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.blog;

  const [blog, setBlog] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogName, setBlogName] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    fetchBlog(controller.signal);
    return () => controller.abort();
  }, [blogName]);

  const fetchBlog = async (signal: AbortSignal) => {
    try {
      const resp = await blogServices.getBlog({ params: { name: blogName }, signal });
      if (resp) setBlog(resp.data);
      setLoading(false);
    } catch (error) {
      if (error !== 'canceled') handlerMessage('', 'error');
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Blog </title>
      </Head>
      <>
        <HeaderPageFragment
          title='Blog'
          isAdd={permission?.write || false}
          addPath='/blog/create'
        />

        <PageContent>
          <BlogListComponent
            data={blog}
            setData={setBlog}
            loading={loading}
            setLoading={setLoading}
            onChangeSearch={setBlogName}
            allowAction={{ add: permission?.write, remove: permission?.remove }}
          />
        </PageContent>
      </>
    </Fragment>
  );
};

export default withAuth(
  withLayout(Index, { sidebar: { openKeys: ['blog'], selectedKey: 'blog-list' } })
);
