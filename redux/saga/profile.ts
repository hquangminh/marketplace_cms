import axios from 'axios';
import { put, takeLeading } from 'redux-saga/effects';
import { CHANGE_PASSWORD, GET_PROFILE, UPDATE_PROFILE } from 'redux/constants';

import {
  // Get profile
  getProfilePending,
  getProfileSuccess,
  getProfileFailed,

  // Update profile
  updateProfilePending,
  updateProfileSuccess,
  updateProfileFailed,

  // Change password
  changePasswordPending,
  changePasswordSuccess,
  changePasswordFailed,
} from 'redux/reducers/auth';

import { handlerMessage, removeCookie } from 'common/functions';
import { tokenList } from 'common/constant';

import { ResponseGenerator } from 'models/response.model';

import authServices from 'services/auth-services';
import administratorServices from 'services/administrator-services';

function* getProfileSaga({ payload }: any) {
  const { id } = payload;

  try {
    yield put(getProfilePending());

    const data: ResponseGenerator = yield authServices.getProfile(id);
    yield put(getProfileSuccess(data.data));

    localStorage.setItem('me', JSON.stringify(data.data));
  } catch (error: any) {
    removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
    localStorage.removeItem('me');

    axios.defaults.headers.common['Authorization'] = '';

    yield put(getProfileFailed());
  }
}

function* updateProfileSaga({ payload }: any) {
  const { id, parm } = payload;

  yield put(updateProfilePending());

  try {
    const data: ResponseGenerator = yield administratorServices.updateAccount(id, parm);
    yield put(updateProfileSuccess(data.data));
    localStorage.setItem('me', JSON.stringify(data.data));

    handlerMessage('Update success', 'success');
  } catch (error: any) {
    yield put(updateProfileFailed());
    handlerMessage('', 'error');
  }
}

function* changePasswordSaga({ payload }: any) {
  const { id, parm, form } = payload;

  yield put(changePasswordPending());

  try {
    yield administratorServices.updateAccount(id, parm);

    handlerMessage('Change success', 'success');
    form.resetFields();
    yield put(changePasswordSuccess());
  } catch (error: any) {
    form.setFields([{ name: 'old_password', errors: ['Current password is not correct!'] }]);
    yield put(changePasswordFailed());
  }
}

export default function* profileSaga() {
  yield takeLeading(GET_PROFILE, getProfileSaga);
  yield takeLeading(UPDATE_PROFILE, updateProfileSaga);
  yield takeLeading(CHANGE_PASSWORD, changePasswordSaga);
}
