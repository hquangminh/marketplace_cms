import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { parmUpload } from 'models/category.model';

const categoryServices = {
  /**
   * Category
   **/

  getAllCategory: async () => {
    const resp = await apiHandler.get(apiConstant.category);

    return resp.data;
  },

  createCategoryList: async (body: parmUpload) => {
    const resp = await apiHandler.create(apiConstant.category, body);

    return resp.data;
  },

  deleteCategory: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.category}/${id}`);

    return resp.data;
  },

  updateCategory: async (id: string, body: parmUpload) => {
    const resp = await apiHandler.update(`${apiConstant.category}/${id}`, body);

    return resp.data;
  },
};

export default categoryServices;
