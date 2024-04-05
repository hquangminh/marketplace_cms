import { typeImg } from './category.model';
import { PriceType } from './modeling-landing-page-pricing';
import { UserModel } from './user.model';

export enum ModelingStatus {
  NEW = 1,
  QUOTE = 2,
  PENDING_PAYMENT = 3,
  IN_PROGRESS = 4,
  IN_REPAIR = 5,
  PENDING_REVIEW = 6,
  FULFILLED = 7,
  CANCELED = 8,
}

export type ModelingProducts = {
  id: string;
  name: string;
  note: string;
  pose?: string;
  status: ModelingStatus;
  price: number;
  size: {
    [key: string]: number;
  };
  unit: number;
  createdAt: Date;
  file_demo: string;
  file_result: string;
  link: string;
  is_upload: boolean;
  image: string;
  isShow: boolean;
  loadingUpload: boolean;
  modeling_product_files: {
    file_name: string;
    file_type: string;
    id: string;
    link: string;
    product_id: string;
  }[];
  is_change: boolean;
  quote_price: PriceType;

  //Check change pricing
  price_id?: string;
  type?: string;
};

export type ModelingOrderModel = {
  id: string;
  amount: number;
  coupon_id: string;
  createdAt: string;
  estimated_time: string;
  is_paid: boolean;
  paygate: string;
  receipt_url: string;
  paidAt: Date;
  market_user: Pick<UserModel, 'id' | 'name' | 'email' | 'image'>;
  status_log: {
    time: string;
    status: number;
  }[];
  name: string;
  order_no: string;
  status: ModelingStatus;
  suggested_time: string;
  modeling_products: ModelingProducts[];
  payment_method?: string;
  reason: string;
};

export type ParamUploadQuote = {
  estimated_time?: Date | string;
  list_product?: { id: string; price: number }[] | [];
};

export type ParamUploadKey = 'file_result_old' | 'file_demo_old' | 'file_result' | 'file_demo';

export type ModalLists = {
  id: string;
  name: string;
  loadingUpload: boolean;
  isShow: boolean;
  files: {
    [key: string]: typeImg[];
  };
};

export type ProductModel = {
  id: string;
  order_id: string;
  name: string;
  price: number;
  status: number;
  createAt: Date;
  modeling_order: {
    id: string;
    name: string;
  };
};

export type ParamUploadProduct = {
  status?: number;
  order_id?: string;
};

export type ParamSort = {
  status?: number;
  name?: string;
  sort_type?: 'desc' | 'asc' | 'desc_nulls_last';
  sort_by?: 'suggested_time' | 'createdAt' | 'estimated_time' | 'updatedAt' | 'quote_time';
};

export type ParamUploadImage = {
  oldImage?: string;
  image: string;
  filename: string;
  filetype: string;
};
