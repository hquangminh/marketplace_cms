import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const uploadFileServices = {
  /**
   * UploadFile
   **/

  uploadFile: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(
      `${apiConstant.media}/uploadFile`,
      parm
    );

    return resp.data;
  },

  uploadFilePresigned: async (parm: paramsType, configAxios?: any) => {
    const resp: ResponseGenerator = await apiHandler.create(
      `${apiConstant.media}/presigned`,
      parm,
      configAxios
    );

    return resp.data;
  },

  deleteUploadFile: async (body: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.delete(
      `${apiConstant.media}/uploadFile`,
      body
    );

    return resp.data;
  },
};

export default uploadFileServices;
