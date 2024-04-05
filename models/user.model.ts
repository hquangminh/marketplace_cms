import { PageAllowActionType } from './common.model';

export type UserComponentType = {
  allowAction?: PageAllowActionType;
  allowActionShowroom?: PageAllowActionType;
};

export type UserOrderType = {
  id: string;
  order_no: number;
  amount: number;
  paygate: string;
  status: number;
  subtotal: number;
  discount: number;
  createdAt: string;
};

export enum UserType {
  CUSTOMER = 1,
  SELLER = 2,
  SHOWROOM = 3,
}

export type UserModel = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  regtype: string;
  market_orders: UserOrderType[];
  market_orders_aggregate: {
    aggregate: {
      count: number;
    };
  };
  status: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserModel[] | undefined>>;
  nickname: string;
  work: string;
  location: string;
  locked: boolean;
};

export type BodyUserSearchType = {
  email: string;
  dates: [string, string];
};

export type UserDetailType = {
  user: UserModel | undefined;
  allowAction: PageAllowActionType;
  loading: boolean;
};
