import { UserModel } from './user.model';

export type ReviewDataType = {};

export type TotalStarsType = {
  [key: string]: number;
};

export type ReviewsType = {
  data: ReviewModel[];
  totalStars: TotalStarsType;
};

export type ReviewViewComponentProps = {
  data: ReviewModel[];
  loading: boolean;
  productId: string | string[] | undefined;
  totalStars: TotalStarsType;
  setReviews: React.Dispatch<React.SetStateAction<ReviewsType>>;
};

export type ReviewModel = {
  id: string;
  content: string;
  like_count: number;
  dislike_count: number;
  item_id: string;
  parentid?: string;
  children?: ReviewModel[];
  totalCommentChild: number;
  market_user: UserModel;
  createdAt: string;
  rate?: number;
  market_reviews?: ReviewModel[];
};
