import {
  GET_ALL_CATEGORY,
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from 'redux/constants';

import { payloadDeleteType, payloadType, payloadUpdateType } from 'models/category.model';

export const onGetAllCategory = () => ({
  type: GET_ALL_CATEGORY,
});

export const onCreateCategory = (payload: payloadType) => ({
  type: CREATE_CATEGORY,
  payload,
});

export const onDeleteCategory = (payload: payloadDeleteType) => ({
  type: DELETE_CATEGORY,
  payload,
});

export const onUpdateCategory = (payload: payloadUpdateType) => ({
  type: UPDATE_CATEGORY,
  payload,
});
