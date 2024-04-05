import React from 'react';
import moment from 'moment';

import { Avatar, Comment, Tooltip } from 'antd';
import { StarFilled } from '@ant-design/icons';

import MyImage from 'components/fragments/Image';

import { ReviewModel } from 'models/review.model';

import styled from 'styled-components';

export type Props = {
  data: ReviewModel;
};
const ReviewItem = (props: Props) => {
  return (
    <Comment
      author={<ReviewAuth>{props.data.market_user.name}</ReviewAuth>}
      avatar={
        <Avatar
          src={
            <MyImage
              src={props.data.market_user.image || ''}
              imgErr='/static/images/avatar-default.png'
            />
          }
          alt={props.data.market_user.name}
        />
      }
      content={
        <ReviewContent>
          <div dangerouslySetInnerHTML={{ __html: props.data.content.replaceAll('\n', '<br/>') }} />
        </ReviewContent>
      }
      datetime={
        <div className='d-flex align-items-center' style={{ gap: 5 }}>
          <Tooltip title={moment(props.data.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <ReviewDate>{moment(props.data.createdAt).fromNow()}</ReviewDate>
          </Tooltip>

          {props.data.rate && (
            <ReviewPoints>
              <StarFilled />
              {props.data.rate}
            </ReviewPoints>
          )}
        </div>
      }>
      {props.data.market_reviews?.map((review) => (
        <Comment
          author={<ReviewAuth>{review.market_user.name}</ReviewAuth>}
          avatar={<Avatar src={review.market_user.image} alt={review.market_user.name} />}
          content={
            <ReviewContent>
              <div dangerouslySetInnerHTML={{ __html: review.content.replaceAll('\n', '<br/>') }} />
            </ReviewContent>
          }
          key={review.id}
          datetime={
            <div className='d-flex align-items-center' style={{ gap: 5 }}>
              <Tooltip title={moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                <ReviewDate>{moment(review.createdAt).fromNow()}</ReviewDate>
              </Tooltip>

              {review.rate && (
                <ReviewPoints>
                  <StarFilled />
                  {review.rate}
                </ReviewPoints>
              )}
            </div>
          }
        />
      ))}
    </Comment>
  );
};

export default ReviewItem;

const ReviewAuth = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-700);
`;
const ReviewDate = styled.div`
  font-size: 12px;
  color: var(--color-gray-7);
`;
const ReviewPoints = styled.div`
  display: flex;
  align-items: center;

  font-size: 12px;
  line-height: 1.33;
  color: var(--text-caption);

  .anticon {
    margin-right: 2px;
    color: #ffc043;
  }
`;
const ReviewContent = styled.div``;
