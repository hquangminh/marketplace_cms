import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const mediaServices = {
  /**
   * Media
   **/

  getAllImage: async (limit: number, offset: number) => {
    const resp: ResponseGenerator = await apiHandler.get(`${apiConstant.media}/${limit}/${offset}`);

    return resp.data;
  },

  createImage: async (parm: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(
      `${apiConstant.media}/uploadImage`,
      parm
    );

    return resp.data;
  },

  deleteImage: async (id: string) => {
    const resp: ResponseGenerator = await apiHandler.delete(
      `${apiConstant.media}/deleteImage/${id}`
    );

    return resp.data;
  },

  searchImageByUser: async (user_id: string, limit: number, offset: number) => {
    const resp: ResponseGenerator = await apiHandler.get(
      `${apiConstant.media}/filter-by-user/${user_id}/${limit}/${offset}`
    );

    return resp.data;
  },

  searchImageByName: async (name: string, limit: number, offset: number) => {
    const resp: ResponseGenerator = await apiHandler.get(
      `${apiConstant.media}/filter-by-name/${name}/${limit}/${offset}`
    );

    return resp.data;
  },
};

export default mediaServices;
