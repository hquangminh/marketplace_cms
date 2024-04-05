import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { ParamsType } from 'models/modeling-landing-page-step';

export type BodyStep = { status?: number };

const stepServices = {
  listStep: async (params?: BodyStep) => {
    const resp = await apiHandler.get(`${apiConstant.step}/list`, { params });
    return resp.data;
  },
  updateStep: async (id: string, body: ParamsType) => {
    const resp = await apiHandler.update(`${apiConstant.step}/${id}`, body);
    return resp.data;
  },

  createStep: async (body: ParamsType) => {
    const resp = await apiHandler.create(apiConstant.step, body);

    return resp.data;
  },

  deleteStep: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.step}/${id}`);
    return resp.data;
  },
};

export default stepServices;
