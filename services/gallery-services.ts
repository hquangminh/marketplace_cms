import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const galleryServices = {
  /**
   * Gallery
   **/

  createGallery: async (body: paramsType) => {
    const resp: ResponseGenerator = await apiHandler.create(
      `${apiConstant.products}/gallery`,
      body
    );

    return resp.data;
  },

  deleteGallery: async (id: string) => {
    const resp: ResponseGenerator = await apiHandler.delete(
      `${apiConstant.products}/gallery/${id}`
    );

    return resp.data;
  },
};

export default galleryServices;
