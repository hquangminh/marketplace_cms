import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

export interface CreateLanguageBody {
  language_name: string;
  image?: string;
}

const settingsServices = {
  getSettings: async () => {
    const resp: ResponseGenerator = await apiHandler.get(apiConstant.settings);

    return resp.data;
  },

  updateSettings: async (id: string, body: paramsType) => {
    const resp = await apiHandler.create(`${apiConstant.settings}`, body);

    return resp.data;
  },

  // Language
  getLanguage: async () => {
    const resp = await apiHandler.get(apiConstant.languageList + '/100/0', null);
    return resp.data;
  },
  deleteLanguage: async (id: string) => {
    const resp = await apiHandler.delete(apiConstant.language + '/' + id);
    return resp.data;
  },
  createLanguage: async (body: CreateLanguageBody) => {
    const resp = await apiHandler.create(apiConstant.language, body);
    return resp.data;
  },
  updateLanguage: async (id: string, body: CreateLanguageBody) => {
    const resp = await apiHandler.update(apiConstant.language + '/' + id, body);
    return resp.data;
  },
};

export default settingsServices;
