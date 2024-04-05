import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { BlogData, BodyParms } from 'models/blog.modes';
import { AxiosRequestConfig } from 'axios';

const blogServices = {
  /**
   * Blog
   **/

  getBlog: async (configs?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.blog, configs);
    return resp.data;
  },

  getCategoryBlog: async () => {
    const resp = await apiHandler.get(apiConstant.categoryBlog);

    return resp.data;
  },

  getBlogDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.blog}/${id}`);

    return resp.data;
  },

  updateBlog: async (id: string, body: BlogData) => {
    const resp = await apiHandler.update(`${apiConstant.blog}/${id}`, body);

    return resp.data;
  },

  createBlog: async (body: BlogData) => {
    const resp = await apiHandler.create(`${apiConstant.blog}`, body);

    return resp.data;
  },

  deleteBlog: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.blog}/${id}`);

    return resp.data;
  },

  getAllCategoryBlog: async () => {
    const resp = await apiHandler.get(apiConstant.categoryBlog);

    return resp.data;
  },

  createCategoryBlog: async (body: BodyParms) => {
    const resp = await apiHandler.create(apiConstant.categoryBlog, body);

    return resp.data;
  },

  updateCategoryBlog: async (id: string, body: BodyParms) => {
    const resp = await apiHandler.update(`${apiConstant.categoryBlog}/${id}`, body);

    return resp.data;
  },

  deleteCategoryBlog: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.categoryBlog}/${id}`);

    return resp.data;
  },

  searchProduct: async (name: string, configs: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.blog + '/products', {
      ...configs,
      params: { name },
    });
    return resp.data;
  },
};

export default blogServices;
