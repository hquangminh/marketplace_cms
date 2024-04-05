import { useEffect, useState } from 'react';

import { Button, Card, Progress } from 'antd';

import productServices from 'services/product-services';
import reviewServices from 'services/review-services';

import { decimalPrecision, handlerMessage } from 'common/functions';

import Loading from 'components/fragments/Loading';
import CalculateReviews from 'components/fragments/calculatorReview';
import ReviewItem from './ReviewItem';

import { ProductModel } from 'models/product.model';
import { ReviewViewComponentProps } from 'models/review.model';
import styled from 'styled-components';

const recordShow = 5;

const ReviewViewComponent = (props: ReviewViewComponentProps) => {
  const { data, loading, productId, totalStars, setReviews } = props;

  const [loadingLoad, setLoadingLoad] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [productDetail, setProductDetail] = useState<ProductModel>();

  const onFetchProductDetail = async () => {
    try {
      const resp = await productServices.getProductDetail(productId as string);
      if (!resp.error) {
        setProductDetail(resp.data);
      }
    } catch (error) {
      handlerMessage('Get product failed', 'error');
    }
  };

  const onFetchDataLoad = async (page: number) => {
    setLoadingLoad(true);

    try {
      const res = await reviewServices.getReviews(
        productId as string,
        recordShow,
        (page - 1) * recordShow
      );

      if (!res.error)
        setReviews((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...res.data],
        }));
      setLoadingLoad(false);
    } catch (error) {
      setLoadingLoad(false);
    }
  };

  const onLoadMore = () => {
    if (data.length === totalStars.total) {
      return;
    }

    setPage((prevState) => prevState + 1);
    onFetchDataLoad(page + 1);
  };

  useEffect(() => {
    onFetchProductDetail();
  }, []);

  return (
    <Wrapper>
      {loading && <Loading isOpacity />}
      <Review__Average>
        <Card
          className='border-0'
          style={{ width: 350 }}
          cover={<img alt='example' src={productDetail?.image} loading={'lazy'} />}>
          <Card.Meta title={productDetail?.title} description='' />
        </Card>

        <div className='d-flex flex-column'>
          <Review__Point>
            <p>
              {Number.isInteger(productDetail?.avgReview)
                ? productDetail?.avgReview + ',0'
                : productDetail?.avgReview}
            </p>
            <CalculateReviews value={productDetail?.avgReview || 0} />
          </Review__Point>

          <Review__Count>
            {totalStars &&
              Object.keys(totalStars).map((item, index) => {
                const percent =
                  ((totalStars[item.toString()] || 0) / (totalStars?.total || 0)) * 100;

                return item.toString() !== 'total' ? (
                  <li key={index}>
                    <span>
                      {index + 1} star{index + 1 > 1 ? 's' : ''}
                    </span>
                    <Progress
                      percent={percent}
                      size='small'
                      strokeColor='#369ca5'
                      showInfo={false}
                    />
                    <span>{decimalPrecision(percent || 0, 2)}%</span>
                  </li>
                ) : null;
              })}
          </Review__Count>
        </div>
      </Review__Average>

      <div className='mt-2' />

      <Review__List>
        {data?.map((review) => {
          return <ReviewItem key={review.id} data={review} />;
        })}
      </Review__List>

      {data?.length !== totalStars?.total && (
        <div className='ProductReview__LoadMore' onClick={onLoadMore}>
          <Button type='primary' loading={loadingLoad}>
            Loading more ({totalStars.total - data.length})
          </Button>
        </div>
      )}
    </Wrapper>
  );
};

export default ReviewViewComponent;

const Wrapper = styled.div`
  .ProductReview__LoadMore {
    margin-top: 10px;
    text-align: center;

    .ant-btn {
      font-size: 12px;
      text-transform: uppercase;
    }
  }
`;
const Review__Average = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 20px;
  box-shadow: rgb(0 0 0 / 8%) 0px 2px 8px 0px;

  .ant-card-body {
    padding: 0;
    padding-top: 10px;
  }
`;
const Review__Point = styled.div`
  text-align: center;

  & > p {
    font-size: 32px;
    font-weight: 600;
    color: var(--text-caption);
  }
`;

const Review__Count = styled.ul`
  li {
    display: flex;
    align-items: center;
    gap: 8px;

    & > span:first-of-type {
      width: 47px;
    }

    & > span,
    .ant-progress-text {
      width: auto;
      font-size: 14px;
      color: var(--text-caption);
    }

    .ant-progress {
      width: 360px;
    }
  }
`;
const Review__List = styled.div``;
