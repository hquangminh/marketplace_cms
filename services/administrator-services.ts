import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { paramsType } from 'models/api-handler.model';

const userIdParam = '{userId}';

const administratorServices = {
  getList: async () => {
    const resp = await apiHandler.get(apiConstant.administrator);
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      user: resp.data.data,
    };
  },

  createAccount: async (parm: paramsType) => {
    const resp = await apiHandler.create(apiConstant.administrator, parm);

    return resp.data;
  },

  getAccountDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.administrator}/${id}`);

    return resp.data;
  },

  updateAccount: async (id: string, parm: paramsType) => {
    const resp = await apiHandler.update(`${apiConstant.administrator}/${id}`, parm);

    return resp.data;
  },

  deleteAccount: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.administrator}/${id}`);

    return resp.data;
  },

  checkAccount: async (parm: paramsType) => {
    const resp = await apiHandler.create(`${apiConstant.administrator}/check`, parm);

    return resp.data;
  },
};

export default administratorServices;
