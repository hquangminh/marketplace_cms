import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { ResponseGenerator } from 'models/response.model';
import { ParamsType } from 'models/license.models';

const licenseServices = {
  /**
   * License
   **/

  getAllLicense: async (params?: ParamsType) => {
    const resp: ResponseGenerator = await apiHandler.get(`${apiConstant.license}/list`, { params });

    return resp.data;
  },

  createLicense: async (body: ParamsType) => {
    const resp = await apiHandler.create(`${apiConstant.license}`, body);

    return resp.data;
  },

  updateLicense: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.license}/${id}`, body);

    return resp.data;
  },

  deleteLicense: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.license}/${id}`);

    return resp.data;
  },
};

export default licenseServices;
