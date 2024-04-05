import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';
import { ParamUploadType } from 'models/modeling-landing-page-banner';

const modelingBannerServices = {
  /**
   * Modeling Banner
   **/

  getAllModelingBanner: async (is_example?: boolean) => {
    const resp = await apiHandler.get(`${apiConstant.modelingBanner}/list`, {
      params: is_example ? { is_example: true } : { is_example: false },
    });

    return resp.data;
  },

  getModelingBannerDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.modelingBanner}/${id}`);

    return resp.data;
  },

  createModelingBanner: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.modelingBanner, parm);

    return resp.data;
  },

  updateModelingBanner: async (id: string, parm: ParamUploadType) => {
    const resp = await apiHandler.update(`${apiConstant.modelingBanner}/${id}`, parm);

    return resp.data;
  },

  deleteModelingBanner: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.modelingBanner}/${id}`);

    return resp.data;
  },

  toggleStatus: async (id: string, status: boolean, is_example?: boolean) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingBanner}/change-status/${id}`,
      is_example ? { status, is_example: true } : { status, is_example: false }
    );

    return resp.data;
  },
};

export default modelingBannerServices;
