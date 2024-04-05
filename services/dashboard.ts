import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const dashboardServices = {
  /**
   * Dashboard
   **/

  getDashboard: async () => {
    const resp = await apiHandler.get(apiConstant.dashboard);

    return resp.data;
  },
};

export default dashboardServices;
