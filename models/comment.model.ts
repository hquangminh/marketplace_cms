import { ProductModel } from './product.model';

export type UserType = {
  email: string;
  id: string;
  image: string | null;
  nickname: string;
  name: string;
};

export type CommentModel = {
  id: string;
  content: string;
  like_count: number;
  dislike_count: number;
  item_id: string;
  parentid?: string;
  children?: CommentModel[];
  totalCommentChild: number;
  market_user: UserType;
  createdAt: string;
  user_replied?: any;
};

export type CommentViewComponentProps = {
  data: CommentModel[];
  loading: boolean;
  total: number;
  setComments: React.Dispatch<React.SetStateAction<{ total: number; data: CommentModel[] }>>;
  productId: string | string[] | undefined;
};

export type CommentListComponentProps = {
  data: ProductModel[] | null;
  loading: boolean;
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
