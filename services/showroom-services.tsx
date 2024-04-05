import apiConstant from 'api/api-constants';
import apiHandler from 'api/api-handler';
import { ShowroomUpdate } from 'models/showroom.models';

const showroomServices = {
  createShowroom: async (body: ShowroomUpdate) => {
    const resp = await apiHandler.create(`${apiConstant.showroom}/register`, body);

    return resp.data;
  },

  sendMail: async (id: string) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/send-mail/${id}`, {});
    return resp.data;
  },

  updateShowroom: async (id: string, body: ShowroomUpdate) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/update/${id}`, body);
    return resp.data;
  },
};

export default showroomServices;
