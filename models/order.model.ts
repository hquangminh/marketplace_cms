import { PageAllowActionType } from './common.model';
import { ItemType, ProductModel } from './product.model';

export type ProductOrder = {
  market_item: ProductModel;
};
export type OrderItemType = {
  id: string;
  order_no: number;
  market_items_boughts: ProductModel[] | ProductOrder[];
  paygate: string;
  amount: number;
  status: number;
  receipt_id?: string;
  receipt_url?: string;
  market_user: {
    id: string;
    name: string;
    email: string;
  };
  updatedAt: string;
  createdAt: string;
  market_coupon: {
    type: string;
    value: number;
    prefix: string;
    code: string;
  } | null;
  payment_method: string;
  paidAt: string;
  items?: ItemType[];
  payment_note?: string;
};

export type OrderComponentType = {
  loading: boolean;
  data: OrderItemType[] | undefined;
  allowAction?: PageAllowActionType;
};

export type OrderSearchParamType = {
  order_no?: number | string;
  receipt?: string;
  dates?: [string, string];
  start?: string;
  end?: string;
};

export type OrderSearchComponentType = {
  loading: boolean;
  data: OrderItemType[] | undefined;
  onSearch: (values: OrderSearchParamType) => void;
  onReset: () => void;
  allowAction?: PageAllowActionType;
};

//Order detail
export type OrderDetailProps = {
  loading: boolean;
  data: OrderItemType | undefined;
  allowAction: PageAllowActionType;
};

export type OrderStatusType = {
  [key: number]: string;
};
