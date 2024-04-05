import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const offsetParam = '{offset}',
  limitParam = '{limit}',
  userIdParam = '{userId}',
  typeParam = '{type}';

const userServices = {
  getUser: async (type: string, offset: number, limit: number) => {
    const resp = await apiHandler.get(
      apiConstant.userList
        .replace(typeParam, type.toString())
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString())
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: { user: resp.data.data, total: resp.data.total },
    };
  },

  searchUser: async (params: { email?: string; start?: string; end?: string }) => {
    const resp = await apiHandler.get(apiConstant.userSearch, { params });
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: { user: resp.data.data },
    };
  },

  getUserDetail: async (userId: string) => {
    const resp = await apiHandler.get(apiConstant.userDetail.replace(userIdParam, userId));
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: { user: resp.data.data },
    };
  },

  createUser: async (body: Record<string, string>) => {
    const resp = await apiHandler.create(apiConstant.users, body);
    return resp.data;
  },

  updateUser: async (id: string, body: { locked: boolean }) => {
    const resp = await apiHandler.update(`${apiConstant.users}/${id}`, body);

    return resp.data;
  },

  edit: async (id: string, body: Record<string, string>) => {
    const resp = await apiHandler.update(apiConstant.users + '/' + id, body);
    return resp.data;
  },

  delete: async (id: string) => {
    const resp = await apiHandler.delete(apiConstant.users + '/' + id);
    return resp.data;
  },
};

export default userServices;
