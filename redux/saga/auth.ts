import { put, takeLeading } from 'redux-saga/effects';
import { LOGIN, REFRESH_TOKEN, VALIDATE_TOKEN } from 'redux/constants';
import axios from 'axios';

import {
  // Login
  loginPending,
  loginFailed,

  // Validate Token
  validationTokenSuccess,
  validationTokenPending,
  validationTokenFailed,
} from 'redux/reducers/auth';

import { handlerMessage, removeCookie, setCookie } from 'common/functions';
import authServices from 'services/auth-services';

import { ResponseGenerator } from 'models/response.model';
import { tokenList } from 'common/constant';

function* loginSaga({ payload }: any) {
  const { values, router } = payload;
  yield put(loginPending());

  try {
    const data: ResponseGenerator = yield authServices.login(values);

    if (typeof router.query.urlBack === 'string') {
      router.push(router.query.urlBack);
    } else {
      router.push('/');
    }
    setCookie(tokenList.TOKEN, data.data.token);
    setCookie(tokenList.REFRESH_TOKEN, data.data.refresh_token);

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
  } catch (error: any) {
    yield put(loginFailed({}));

    removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);

    axios.defaults.headers.common['Authorization'] = '';
    handlerMessage(error?.data?.message, 'error');
  }
}

function* validateTokenSaga({ payload }: any) {
  yield put(validationTokenPending());

  try {
    const data: ResponseGenerator = yield authServices.validateToken({ token: payload });

    if (!data.error) {
      yield put(validationTokenSuccess());
    } else {
      handlerMessage(`The token isn't correct`, 'error');

      removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
      localStorage.removeItem('me');

      axios.defaults.headers.common['Authorization'] = '';
    }

    // yield put(loginSuccess(data));
  } catch (error: any) {
    yield put(validationTokenFailed());
    localStorage.removeItem('me');

    handlerMessage(error?.data?.message, 'error');
  }
}

function* refreshTokenSaga({ payload }: any) {
  axios.defaults.headers.common['Authorization'] = '';

  try {
    const data: ResponseGenerator = yield authServices.refreshToken(payload);

    if (!data.error) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      setCookie(tokenList.TOKEN, data.data.token);
      setCookie(tokenList.REFRESH_TOKEN, data.data.refresh_token);
    }
  } catch (error: any) {
    removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
    localStorage.removeItem('me');

    axios.defaults.headers.common['Authorization'] = '';
    handlerMessage('Login expired, please login again', 'error');
  }
}

export default function* authSaga() {
  yield takeLeading(LOGIN, loginSaga);

  yield takeLeading(VALIDATE_TOKEN, validateTokenSaga);

  yield takeLeading(REFRESH_TOKEN, refreshTokenSaga);
}
