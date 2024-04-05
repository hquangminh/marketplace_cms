import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { CouponBodyRequestType } from 'models/coupon.models';

const paramUrl = { couponId: '{couponId}' };

const couponServices = {
  getCoupons: async () => {
    const resp = await apiHandler.get(apiConstant.coupon);
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },

  addCoupon: async (body: CouponBodyRequestType) => {
    const resp = await apiHandler.create(apiConstant.coupon, body);
    return {
      status: resp.status,
      error: resp.data.error,
      error_code: resp.data.error_code,
      message: resp.data.message,
      data: resp.data.data,
    };
  },

  updateCoupon: async (couponId: string, body: CouponBodyRequestType) => {
    const resp = await apiHandler.update(
      apiConstant.couponDetail.replace(paramUrl.couponId, couponId),
      body
    );
    return {
      status: resp.status,
      error: resp.data.error,
      error_code: resp.data.error_code,
      message: resp.data.message,
      data: resp.data.data,
    };
  },

  deleteCoupon: async (couponId: string) => {
    const resp = await apiHandler.delete(
      apiConstant.couponDetail.replace(paramUrl.couponId, couponId)
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },
};

export default couponServices;
