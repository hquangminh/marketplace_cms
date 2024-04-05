import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { OrderSearchParamType } from 'models/order.model';

const paramUrl = {
  endDate: '{end_date}',
  orderId: '{order_id}',
};

const orderServices = {
  getOrderNewest: async (end_date: string) => {
    const resp = await apiHandler.get(apiConstant.orderNewest.replace(paramUrl.endDate, end_date));
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: { order: resp.data.data, total: resp.data.total },
    };
  },

  searchOrder: async (body: OrderSearchParamType) => {
    const resp = await apiHandler.create(apiConstant.orderSearch, body);
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: { order: resp.data.data || [] },
    };
  },

  getOrderDetail: async (orderId: string) => {
    const resp = await apiHandler.get(apiConstant.orderDetail.replace(paramUrl.orderId, orderId));
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },
};

export default orderServices;
