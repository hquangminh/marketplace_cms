import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const commentServices = {
  /**
   * Comment
   **/

  getComments: async (productId: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(
      `${apiConstant.comments}/item/${productId}/${limit}/${offset}`
    );
    return resp.data;
  },
};

export default commentServices;
