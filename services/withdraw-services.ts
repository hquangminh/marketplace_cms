import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { UpdateWithdraw } from 'models/withdraw.model';

export type BodyFilterWithdraw = { status?: number; start_date?: string; end_date?: string };

const withdrawServices = {
  postListWithdraw: async (limit: number, offset: number, params?: BodyFilterWithdraw) => {
    const resp = await apiHandler.get(`${apiConstant.withdraw}/cms/${limit}/${offset}`, { params });
    return resp.data;
  },
  getWithdrawDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.withdraw}/${id}`);

    return resp.data;
  },

  updateWithDraw: async (id: string, body: UpdateWithdraw) => {
    const resp = await apiHandler.update(`${apiConstant.withdraw}/${id}`, body);
    return resp.data;
  },
};

export default withdrawServices;
