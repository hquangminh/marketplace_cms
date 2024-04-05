import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import commentServices from 'services/comment-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import CommentViewComponent from 'components/pages/Comments/View';

import { CommentModel } from 'models/comment.model';

const Index: React.FC = () => {
  const router = useRouter();
  const productId: string | string[] | undefined = router.query.productId;

  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<{
    total: number;
    data: CommentModel[];
  }>({
    total: 0,
    data: [],
  });

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const res = await commentServices.getComments(id, 5, 0);

      if (!res.error)
        setComments({
          total: res.total,
          data: res.data,
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(productId as string);
  }, []);

  return (
    <>
      <Head>
        <title>Market Place Admin - Product Comments</title>
      </Head>

      <HeaderPageFragment title='Product Comments' addPath='/products/comments' />

      <CommentViewComponent
        data={comments?.data}
        loading={loading}
        productId={productId}
        total={comments?.total}
        setComments={setComments}
      />
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['products'] } }));
