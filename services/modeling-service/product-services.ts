import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

export type BodyStatusFeedback = { status?: number };
export type BodyContentFeedback = { content?: string };

const productServices = {
  getOrderFeedbackDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.modelingServiceListFeedback}/${id}`);

    return resp.data;
  },

  getListFeedbackDetail: async (params: { limit: number; offset: number; status?: number }) => {
    const { limit, offset, status } = params;
    const resp = await apiHandler.get(
      `${apiConstant.modelingServiceListFeedback}/${limit}/${offset}`,
      { params: { status } }
    );

    return resp.data;
  },

  updateStatusFeedback: async (id: string | undefined, body: BodyStatusFeedback) => {
    const resp = await apiHandler.update(
      `${apiConstant.modelingServiceListFeedback}/status/${id}`,
      body
    );
    return resp.data;
  },

  createFeedback: async (id: string | undefined, body: BodyContentFeedback) => {
    const resp = await apiHandler.create(`${apiConstant.modelingServiceListFeedback}/${id}`, body);

    return resp.data;
  },
};

export default productServices;
