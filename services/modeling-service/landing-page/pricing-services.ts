import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { ParamsType } from 'models/modeling-landing-page-pricing';

export type BodyPrice = { status?: number };

const modelingPriceServices = {
  listPricing: async (params?: BodyPrice) => {
    const resp = await apiHandler.get(`${apiConstant.modelingPricing}/list`, { params });
    return resp.data;
  },
  updatePricing: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.modelingPricing}/${id}`, body);
    return resp.data;
  },

  createPricing: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.modelingPricing, body);

    return resp.data;
  },

  getPricingDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.modelingPricing}/${id}`);

    return resp.data;
  },

  deletePricing: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.modelingPricing}/${id}`);
    return resp.data;
  },
};

export default modelingPriceServices;
