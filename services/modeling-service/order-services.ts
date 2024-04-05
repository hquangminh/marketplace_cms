import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import {
  ParamSort,
  ParamUploadImage,
  ParamUploadQuote,
  ParamUploadProduct,
} from 'models/modeling-landing-page-orders';
import { AxiosRequestConfig } from 'axios';

const orderServices = {
  /**
   * Orders
   **/

  getAllOrders: async (values: { limit: number; offset: number; params: ParamSort }) => {
    const { limit, offset, params } = values;
    const resp = await apiHandler.get(
      `${apiConstant.modelingServiceOrders}/list/${limit}/${offset}`,
      { params }
    );

    return resp.data;
  },

  getAllProduct: async (values: { limit: number; offset: number; params?: ParamUploadProduct }) => {
    const { limit, offset, params } = values;
    const resp = await apiHandler.get(`${apiConstant.modelingProduct}/list/${limit}/${offset}`, {
      params,
    });

    return resp.data;
  },

  getOrderDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.modelingServiceOrders}/order/${id}`);

    return resp.data;
  },

  quoteModelingOrder: async (id: string, params: ParamUploadQuote) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceOrders}/update-quote/${id}`,
      params
    );

    return resp.data;
  },

  sendQuoteModelingOrder: async (id: string) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceOrders}/send-quote/${id}`,
      undefined
    );

    return resp.data;
  },

  uploadModelOrder: async ({
    orderId,
    productId,
    params,
    config,
  }: {
    orderId: string;
    productId: string;
    params: Record<string, string>;
    config?: AxiosRequestConfig;
  }) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceOrders}/order/upload-model/${orderId}/${productId}`,
      params,
      config
    );

    return resp.data;
  },

  confirmUploadModelOrder: async (id: string) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceOrders}/order/upload-model/confirm/${id}`,
      {}
    );

    return resp.data;
  },

  cancelOrder: async (id: string, reason: string) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceOrders}/order/cancel/${id}`,
      { reason }
    );

    return resp.data;
  },

  searchOrder: async (limit: number, offset: number, name: string) => {
    const resp = await apiHandler.create(
      `${apiConstant.modelingServiceOrders}/order/list/search/${limit}/${offset}`,
      {
        name,
      }
    );

    return resp.data;
  },

  uploadAvatar: async (id: string, params: ParamUploadImage) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingProduct}/upload-avatar/${id}`,
      params
    );

    return resp.data;
  },

  confirmUploadModelFeedback: async (id: string) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceListFeedback}/confirm/${id}`,
      {}
    );

    return resp.data;
  },
};

export default orderServices;
