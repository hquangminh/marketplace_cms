import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import reviewServices from 'services/review-services';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ReviewViewComponent from 'components/pages/Reviews/View';

import { ReviewsType } from 'models/review.model';

import { PageContent } from 'styles/__styles';

const Index: React.FC = () => {
  const router = useRouter();
  const productId: string | string[] | undefined = router.query.productId;

  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<ReviewsType>({
    data: [],
    totalStars: {
      total_rating_one: 0,
      total_rating_two: 0,
      total_rating_three: 0,
      total_rating_four: 0,
      total_rating_five: 0,
      total: 0,
    },
  });

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const res = await reviewServices.getReviews(id, 5, 0);

      if (!res.error) {
        let newData = { ...res };
        delete newData['error'];
        setReviews(() => ({
          data: newData.data,
          totalStars: {
            total_rating_one: newData.total_rating_one,
            total_rating_two: newData.total_rating_two,
            total_rating_three: newData.total_rating_three,
            total_rating_four: newData.total_rating_four,
            total_rating_five: newData.total_rating_five,
            total: newData.total,
          },
        }));
      }
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
        <title>Market Place Admin - Product Reviews</title>
      </Head>

      <HeaderPageFragment title='Product Review' addPath='/review' />

      <PageContent>
        <ReviewViewComponent
          data={reviews?.data}
          loading={loading}
          productId={productId}
          setReviews={setReviews}
          totalStars={reviews.totalStars}
        />
      </PageContent>
    </>
  );
};

export default withAuth(withLayout(Index, { sidebar: { openKeys: ['products'] } }));
