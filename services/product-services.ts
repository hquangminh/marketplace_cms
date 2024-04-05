import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';

const offsetParam = '{offset}',
  limitParam = '{limit}';

export interface InitialFilter {
  minPrice?: number;
  maxPrice?: number;
  is_pbr?: boolean;
  is_animated?: boolean;
  is_rigged?: boolean;
  sort_by?: string;
  sort_type?: string;
  offset?: number;
  limit?: number;
  keyword?: string;
}

const productServices = {
  getProductPopular: async (offset: number, limit: number, name?: string) => {
    const resp = await apiHandler.get(
      apiConstant.productPopular
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString()),
      {
        params: {
          name,
        },
      }
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
      total: resp.data.total,
    };
  },

  getProductHotest: async (offset: number, limit: number, name?: string) => {
    const resp = await apiHandler.get(
      apiConstant.productHotest
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString()),
      {
        params: {
          name,
        },
      }
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
      total: resp.data.total,
    };
  },

  getProductNewest: async (offset: number, limit: number, name?: string) => {
    const resp = await apiHandler.get(
      apiConstant.productNewest
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString()),
      {
        params: {
          name,
        },
      }
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
      total: resp.data.total,
    };
  },

  getProductTemporary: async (offset: number, limit: number, name?: string) => {
    const resp = await apiHandler.get(`${apiConstant.products}/cms/temporary/${limit}/${offset}`, {
      params: {
        name,
      },
    });

    return resp.data;
  },

  filterProducts: async ({
    limit,
    offset,
    params,
  }: {
    limit: number;
    offset: number;
    params: InitialFilter;
  }) => {
    const resp = await apiHandler.get(`${apiConstant.productFilter}/${limit}/${offset}`, {
      params,
    });

    return resp.data;
  },

  searchProduct: async (keyword?: string) => {
    const resp = await apiHandler.get(`${apiConstant.productSearch}`, {
      params: {
        keyword,
      },
    });

    return resp.data;
  },

  createProduct: async (body: paramsType) => {
    const resp = await apiHandler.create(apiConstant.products, body);

    return resp.data;
  },

  getProductDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.products}/${id}`);

    return resp.data;
  },

  updateProduct: async (id: string, body: paramsType, configAxios?: any) => {
    const resp = await apiHandler.update(`${apiConstant.products}/${id}`, body, configAxios);

    return resp.data;
  },

  deleteProduct: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.products}/${id}`);

    return resp.data;
  },

  deleteTemporary: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.products}/cms/${id}/temporary`);

    return resp.data;
  },

  restoreProduct: async (id: string) => {
    const resp = await apiHandler.create(`${apiConstant.products}/cms/${id}/restore`, null);

    return resp.data;
  },
  createProductFeatured: async (body: paramsType) => {
    const resp = await apiHandler.create(`${apiConstant.products}/featured/bulk`, { items: body });

    return resp.data;
  },

  deleteProductFeatured: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.products}/featured/${id}`);

    return resp.data;
  },

  deleteProductFeaturedAll: async () => {
    const resp = await apiHandler.delete(`${apiConstant.products}/featured/all`);

    return resp.data;
  },

  getProductFeatured: async () => {
    const resp = await apiHandler.get(`${apiConstant.products}/featured`);

    return resp.data;
  },
};

export default productServices;
