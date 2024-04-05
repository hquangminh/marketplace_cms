import {
  CHANGE_PASSWORD,
  GET_PROFILE,
  LOGIN,
  REFRESH_TOKEN,
  UPDATE_PROFILE,
  VALIDATE_TOKEN,
} from 'redux/constants';
import { LoginType } from 'models/response.model';
import { profileType, validateTokenType } from 'models/auth.model';

export const onLogin = (payload: LoginType) => ({
  type: LOGIN,
  payload,
});

export const onGetProfile = (payload: profileType) => ({
  type: GET_PROFILE,
  payload,
});

export const onUpdateProfile = (payload: profileType) => ({
  type: UPDATE_PROFILE,
  payload,
});

export const onChangePassword = (payload: profileType) => ({
  type: CHANGE_PASSWORD,
  payload,
});

export const onValidateToken = (payload: validateTokenType) => ({
  type: VALIDATE_TOKEN,
  payload,
});

export const onRefreshToken = (payload: validateTokenType) => ({
  type: REFRESH_TOKEN,
  payload,
});
