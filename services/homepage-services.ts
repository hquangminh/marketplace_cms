import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { paramsType } from 'models/api-handler.model';
import { ResponseGenerator } from 'models/response.model';

const homepageServices = {
  getHomepage: async () => {
    const resp: ResponseGenerator = await apiHandler.get(apiConstant.homepage + '/all');
    return resp.data;
  },
  updateHomepage: async (body: paramsType) => {
    const resp = await apiHandler.update(`${apiConstant.homepage}`, body);
    return resp.data;
  },
};

export default homepageServices;
