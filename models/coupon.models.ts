import { PageAllowActionType } from './common.model';

export type CouponType = {
  id: string;
  prefix: string;
  code: string;
  type: string;
  value: string;
  status: boolean;
  amount: number | null;
  used: number | null;
  start: string;
  expired: string;
  market_orders_aggregate: {
    aggregate: { count: number };
  };
  min_order: number;
  max_discount: number;
  reuse: number;
};

export type CouponProps = {
  allowAction: PageAllowActionType;
  loading: boolean;
  data: CouponType[] | undefined;
  updateCouponList: (
    type: 'add' | 'update' | 'delete',
    couponId: string,
    coupon?: CouponType
  ) => void;
};

export type CouponAction = {
  type: 'add' | 'edit' | 'view' | null;
  coupon: CouponType | null;
};

export type CouponActionProps = {
  allowAction: PageAllowActionType;
  loading?: boolean;
  type: 'add' | 'edit' | 'view' | null;
  data: CouponType | null;
  onDelete: (couponId: string) => void;
  updateCouponList: (
    type: 'add' | 'update' | 'delete',
    couponId: string,
    coupon?: CouponType
  ) => void;
  onChangeToEdit: () => void;
  onClose: () => void;
};

export type CouponBodyRequestType = {
  prefix?: string;
  code?: string;
  type?: string;
  amount?: number;
  value?: string;
  expired?: string;
  status: boolean;
  min_order?: number;
  max_discount?: number;
  start?: string;
  reuse?: number;
};
