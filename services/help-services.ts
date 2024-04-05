import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { DataHelpType, ParamUpload } from 'models/help-model';

const helpServices = {
  /**
   * Help
   **/

  getHelp: async (params: { category?: string; title?: string }) => {
    const resp = await apiHandler.get(`${apiConstant.help}/cms`, { params });

    return resp.data;
  },

  getHelpDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.help}/cms/${id}`);

    return resp.data;
  },

  updateHelp: async (id: string, body: DataHelpType) => {
    const resp = await apiHandler.update(`${apiConstant.help}/${id}`, body);

    return resp.data;
  },

  createHelp: async (body: DataHelpType) => {
    const resp = await apiHandler.create(`${apiConstant.help}`, body);

    return resp.data;
  },

  deleteHelp: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.help}/${id}`);

    return resp.data;
  },

  getAllHelpCategory: async () => {
    const resp = await apiHandler.get(apiConstant.helpCategory);

    return resp.data;
  },

  createHelpCategory: async (body: ParamUpload) => {
    const resp = await apiHandler.create(apiConstant.helpCategory, body);

    return resp.data;
  },

  updateHelpCategory: async (id: string, body: ParamUpload) => {
    const resp = await apiHandler.update(`${apiConstant.helpCategory}/${id}`, body);

    return resp.data;
  },

  deleteHelpCategory: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.helpCategory}/${id}`);

    return resp.data;
  },
};

export default helpServices;
