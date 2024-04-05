import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';

import { useAppDispatch } from 'redux/hooks';
import { getProfileSuccess, setLoading } from 'redux/reducers/auth';

import { checkPermission, handlerMessage, isStrEmpty, removeCookie } from 'common/functions';
import { tokenList } from 'common/constant';

import authServices from 'services/auth-services';
import ErrorCode from 'api/error-code';

import Loading from 'components/fragments/Loading';

import { userType } from 'models/auth.model';

type AuthModel = {
  token?: string;
  user?: userType;
  error_code?: string;
};

type SSRProps = {
  auth: AuthModel;
};

export type withAuthProps = SSRProps & {};

const withAuth = (BaseComponent: React.ComponentType<withAuthProps | undefined | any>) => {
  const App = (props: SSRProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    if (props.auth.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${props.auth.token}`;

    useEffect(() => {
      if (!props.auth?.token) {
        removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
        router.push(router.asPath === '/' ? '/login' : `/login?urlBack=${router.asPath}`);

        if (!props.auth?.token) {
          handlerMessage(ErrorCode[props.auth.error_code ?? 'TOKEN_NOT_CORRECT'], 'error');
        }
        return;
      }
      dispatch(setLoading(false));
      dispatch(getProfileSuccess(props.auth.user));
    }, []);

    return !props.auth?.token ? <Loading size='large' fullPage /> : <BaseComponent {...props} />;
  };

  App.getInitialProps = async (context: any) => {
    const cookies = new Cookies();
    const getCookies = context.req ? context.req.headers.cookie : window.document.cookie;

    const getToken = !isStrEmpty(getCookies)
      ? getCookies.split(';').find((c: string) => c.trim().startsWith(`${tokenList.TOKEN}=`))
      : '';
    let token = !isStrEmpty(getToken) ? getToken.split('=')[1] : null;

    let decoded: any = null;
    let checkRefreshToken = null;
    let allowAccess = false;

    let auth: AuthModel = { token: token };

    //Get me
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      decoded = jwt.decode(token);

      await authServices
        .getProfile(decoded ? decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'] : '1')
        .then(({ data }) => (auth.user = data))
        .catch((error: AxiosResponse) => (auth.error_code = error.data?.error_code));

      // Refresh Token
      if (auth.user) {
        try {
          checkRefreshToken = decoded?.exp * 1000 - Date.now() < 30 * 60 * 1000;
          const getRefreshToken = !isStrEmpty(getCookies)
            ? getCookies
                .split(';')
                .find((c: string) => c.trim().startsWith(`${tokenList.REFRESH_TOKEN}=`))
            : '';
          const refresh_token = !isStrEmpty(getRefreshToken) ? getRefreshToken.split('=')[1] : null;

          if (checkRefreshToken && refresh_token) {
            const resReFresh = await authServices.refreshToken({ token, refresh_token });

            if (!resReFresh.error) {
              auth.token = resReFresh.data.token;
              cookies.set(tokenList.TOKEN, resReFresh.data.token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
              });
            }
          }
        } catch (error) {
          delete auth.token;
        }
      } else delete auth.token;
    }

    // Check permission
    if (auth.user) allowAccess = checkPermission(context.pathname, auth.user.permis);

    return { auth, allowAccess };
  };

  return App;
};

export default withAuth;
