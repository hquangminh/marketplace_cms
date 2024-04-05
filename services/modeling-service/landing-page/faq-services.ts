import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { ParamsType } from 'models/modeling-landing-page-faq';

export type BodyFaq = { status?: number };

const FaqServices = {
  listFaq: async (params?: BodyFaq) => {
    const resp = await apiHandler.get(`${apiConstant.faq}/list`, { params });
    return resp.data;
  },
  updateFaq: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.faq}/${id}`, body);
    return resp.data;
  },

  createFaq: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.faq, body);

    return resp.data;
  },

  deleteFaq: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.faq}/${id}`);
    return resp.data;
  },
};

export default FaqServices;
