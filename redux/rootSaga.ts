import { all, fork } from 'redux-saga/effects';
import authSaga from './saga/auth';
import categorySaga from './saga/category';
import profileSaga from './saga/profile';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(categorySaga), fork(profileSaga)]);
}
