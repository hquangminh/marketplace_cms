import { useEffect, useState } from 'react';
import { Button, Card } from 'antd';

import { handlerMessage } from 'common/functions';

import commentServices from 'services/comment-services';
import productServices from 'services/product-services';

import Loading from 'components/fragments/Loading';
import CommentItem from './CommnetItem';

import { ProductModel } from 'models/product.model';
import { CommentViewComponentProps } from 'models/comment.model';

import { PageContent } from 'styles/__styles';
import * as L from './style';

const recordShow = 5;

const CommentViewComponent = (props: CommentViewComponentProps) => {
  const { data, loading, total, setComments, productId } = props;

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

  useEffect(() => {
    onFetchProductDetail();
  }, []);

  const onFetchDataLoad = async (page: number) => {
    setLoadingLoad(true);

    try {
      const res = await commentServices.getComments(
        productId as string,
        recordShow,
        (page - 1) * recordShow
      );

      if (!res.error)
        setComments((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...res.data],
        }));
      setLoadingLoad(false);
    } catch (error) {
      setLoadingLoad(false);
    }
  };

  const onLoadMore = () => {
    if (data.length === total) {
      return;
    }

    setPage((prevState) => prevState + 1);
    onFetchDataLoad(page + 1);
  };

  return (
    <L.CommentViewComponent_wrapper>
      <PageContent className='position-relative'>
        {loading ? (
          <Loading isOpacity />
        ) : (
          <>
            <Card
              style={{ width: 350 }}
              cover={<img alt='example' src={productDetail?.image} loading={'lazy'} />}>
              <Card.Meta title={productDetail?.title} description='' />
            </Card>

            <div className='mt-2' />

            {data?.map((comment) => {
              return <CommentItem data={comment} key={comment.id} />;
            })}
            {data.length !== total ? (
              <div className='text-center'>
                <Button
                  type='primary'
                  className='btn__load'
                  onClick={onLoadMore}
                  loading={loadingLoad}>
                  Loading more ({total - data.length})
                </Button>
              </div>
            ) : null}
          </>
        )}
      </PageContent>
    </L.CommentViewComponent_wrapper>
  );
};

export default CommentViewComponent;
