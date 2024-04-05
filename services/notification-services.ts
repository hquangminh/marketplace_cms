import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { NotifyStatusType } from 'models/dashboard.model';

const notificationServices = {
  /**
   * Notification
   **/

  getNotification: async () => {
    const resp = await apiHandler.get(apiConstant.notification);

    return resp.data;
  },

  getNotificationCount: async () => {
    const resp = await apiHandler.get(`${apiConstant.notification}/count`);

    return resp.data;
  },

  markReadNotification: async (body: { type: NotifyStatusType }) => {
    const resp = await apiHandler.update(`${apiConstant.notification}/mark-read`, body);

    return resp.data;
  },
};

export default notificationServices;
