import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { ParamsType } from 'models/customer.model';

export type BodyCustomer = { status?: number };

const customerServices = {
  listCustomer: async (params?: BodyCustomer) => {
    const resp = await apiHandler.get(`${apiConstant.customer}/list`, { params });
    return resp.data;
  },
  updateCustomer: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.customer}/${id}`, body);
    return resp.data;
  },

  createCustomer: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.customer, body);

    return resp.data;
  },

  deleteCustomer: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.customer}/${id}`);
    return resp.data;
  },
};

export default customerServices;
