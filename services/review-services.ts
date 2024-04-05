import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const reviewServices = {
  /**
   * Review
   **/

  getReviews: async (productId: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(
      `${apiConstant.reviews}/item/${productId}/${limit}/${offset}`
    );
    return resp.data;
  },
};

export default reviewServices;
