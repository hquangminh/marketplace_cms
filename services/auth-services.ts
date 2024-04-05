import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const authServices = {
  /**
   * Auth
   **/

  login: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.auth, parm);
    return resp.data;
  },

  logout: async () => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.logout, {});

    return resp.data;
  },

  getProfile: async (id: string) => {
    const resp: ResponseGenerator = await apiHandler.getAuth(`${apiConstant.profile}/${id}`);

    return resp.data;
  },

  validateToken: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.validateToken, parm);

    return resp.data;
  },

  refreshToken: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(apiConstant.refreshToken, parm);

    return resp.data;
  },
};

export default authServices;
