import { AxiosResponse } from 'axios';
import { NextRouter } from 'next/router';

export interface ResponseGenerator extends AxiosResponse {
  user?: any;
  error?: boolean;
  message?: string;
}

export interface LoginType {
  values: {
    username: string;
    password: string;
  };
  router?: NextRouter;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IDType {
  id: 'string';
}
