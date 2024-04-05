import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { ParamsType } from 'models/brands-model';

export type BodyBrands = { status?: boolean };
type ListBrandParameters = { limit: number; offset: number; params?: BodyBrands };

const brandsServices = {
  listBrands: async ({ limit, offset, params }: ListBrandParameters) => {
    const resp = await apiHandler.get(`${apiConstant.brands}/list/${limit}/${offset}`, { params });
    return resp.data;
  },
  updateBrands: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.brands}/${id}`, body);
    return resp.data;
  },

  createBrands: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.brands, body);

    return resp.data;
  },

  deleteBrands: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.brands}/${id}`);
    return resp.data;
  },

  getBrandsDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.brands}/${id}`);

    return resp.data;
  },
};

export default brandsServices;
