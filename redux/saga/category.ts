import { put, takeLeading } from 'redux-saga/effects';
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_CATEGORY,
  UPDATE_CATEGORY,
} from 'redux/constants';

import {
  // Create Category
  createCategoryFailed,
  createCategoryPending,
  createCategorySuccess,

  // Get All Category
  getAllCategoryFailed,
  getAllCategoryPending,
  getAllCategorySuccess,

  // Delete Category
  deleteCategoryPending,
  deleteCategorySuccess,
  deleteCategoryFailed,

  // Update Category
  updateCategoryPending,
  updateCategorySuccess,
  updateCategoryFailed,
} from 'redux/reducers/category';

import { deleteItemInObject, handlerMessage } from 'common/functions';

import categoryServices from 'services/category-services';

import { ResponseGenerator } from 'models/response.model';

function* getAllCategorySaga() {
  yield put(getAllCategoryPending());
  try {
    const data: ResponseGenerator = yield categoryServices.getAllCategory();

    yield put(getAllCategorySuccess(data.data));
  } catch (error: any) {
    yield put(getAllCategoryFailed(error.data));
    handlerMessage(error?.data?.message, 'error');
  }
}

function* createCategorySaga({ payload }: any) {
  const { parm, callBack, setExpandedKeys } = payload;
  yield put(createCategoryPending());

  try {
    const data: ResponseGenerator = yield categoryServices.createCategoryList(
      deleteItemInObject(parm)
    );
    callBack();
    handlerMessage('Create success', 'success');
    setExpandedKeys([parm.parentid || '']);
    yield put(createCategorySuccess(data.data));
  } catch (error: any) {
    yield put(createCategoryFailed(error.data));
    handlerMessage(error?.data?.message, 'error');
  }
}

function* deleteCategorySaga({ payload }: any) {
  const { id, callBack, setActiveMenu, setId } = payload;

  yield put(deleteCategoryPending());
  try {
    yield categoryServices.deleteCategory(id);

    yield put(deleteCategorySuccess(id));
    callBack();
    setActiveMenu([]);
    setId('');
    handlerMessage('Delete category success', 'success');
  } catch (error: any) {
    yield put(deleteCategoryFailed());
    handlerMessage(error?.data?.message, 'error');
  }
}

function* updateCategorySaga({ payload }: any) {
  const { id, parm }: any = payload;

  yield put(updateCategoryPending());
  try {
    const data: ResponseGenerator = yield categoryServices.updateCategory(id, parm);

    yield put(updateCategorySuccess({ id, data: data.data }));
    handlerMessage('Update category success', 'success');
  } catch (error: any) {
    yield put(updateCategoryFailed());
    handlerMessage(error?.data?.message, 'error');
  }
}

export default function* categorySaga() {
  yield takeLeading(GET_ALL_CATEGORY, getAllCategorySaga);
  yield takeLeading(CREATE_CATEGORY, createCategorySaga);
  yield takeLeading(DELETE_CATEGORY, deleteCategorySaga);
  yield takeLeading(UPDATE_CATEGORY, updateCategorySaga);
}
