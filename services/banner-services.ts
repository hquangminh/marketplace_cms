import { ParamsType } from 'models/banner.model';
import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { ResponseGenerator } from 'models/response.model';

const bannerServices = {
  /**
   * Banner
   **/

  getBanner: async () => {
    const resp: ResponseGenerator = await apiHandler.get(`${apiConstant.banner}/list`);

    return resp.data;
  },

  createBanner: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.banner, body);

    return resp.data;
  },

  updateBanner: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.banner}/${id}`, body);

    return resp.data;
  },

  deleteBanner: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.banner}/${id}`);

    return resp.data;
  },

  activeBanner: async (id: string, status: boolean) => {
    const resp = await apiHandler.update(`${apiConstant.banner}/change-status/${id}`, {
      status,
    });

    return resp.data;
  },

  createBannerPost: async (id: string, status: boolean, type: string) => {
    const resp = await apiHandler.create(`${apiConstant.brands}/${id}`, {
      type,
      status,
    });
    return resp;
  },
};

export default bannerServices;
