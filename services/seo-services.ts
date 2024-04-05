import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const seoServices = {
  /**
   * Seo
   **/

  createSeo: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.seo, parm);
    return resp.data;
  },

  getSeoList: async (params?: any) => {
    const resp: ResponseGenerator = await apiHandler.get(apiConstant.seo + '/list', { params });
    return resp.data;
  },

  getSeo: async (seoId: string) => {
    const resp: ResponseGenerator = await apiHandler.get(`${apiConstant.seo}/${seoId}`);

    return resp.data;
  },

  deleteSeo: async (seoId: string) => {
    const resp: ResponseGenerator = await apiHandler.delete(`${apiConstant.seo}/${seoId}`);

    return resp.data;
  },

  updateSeo: async (id: string, body: paramsType) => {
    const resp = await apiHandler.update(`${apiConstant.seo}/${id}`, body);

    return resp.data;
  },
};

export default seoServices;
