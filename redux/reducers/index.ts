import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './auth';
import categoryReducer from './category';
import notifyCountReducer from './notification';

const rootReducer = combineReducers({
  auth: usersReducer,
  category: categoryReducer,
  count: notifyCountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
