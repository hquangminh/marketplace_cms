import { FormInstance } from 'antd';
import { NextRouter } from 'next/router';

type PermissionItemType = {
  list: boolean;
  read: boolean;
  write: boolean;
  remove: boolean;
};
export type PermissionType = {
  category: PermissionItemType;
  products: PermissionItemType;
  users: PermissionItemType;
  orders: PermissionItemType;
  coupons: PermissionItemType;
  media: PermissionItemType;
  accounts: PermissionItemType;
  reports: PermissionItemType;
  seo: PermissionItemType;
  help: PermissionItemType;
  blog: PermissionItemType;
  banner: PermissionItemType;
  license: PermissionItemType;
  withdraw: PermissionItemType;
  notification: PermissionItemType;
  showroom: PermissionItemType;
};
export interface userType {
  id?: string;
  image?: string | null;
  group?: string;
  permis?: PermissionType;
  status?: boolean;
  name?: string;
  username?: string;
  email?: string;
}

export interface userTypeWrapper {
  token: string;
  refresh_token: string;
  user: userType;
}

export interface authType {
  data?: userTypeWrapper;
  me?: userType;
  loading?: boolean;
  loadingGetProfile?: boolean;
  loadingUpdate?: boolean;
  loadingChangePass?: boolean;
  msg?: string;
  authVerifier?: boolean;
}

export interface profileType {
  id?: string | undefined;
  parm?: userType;
  router?: NextRouter;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  form?: FormInstance<any>;
}

export interface validateTokenType {
  token: string;
  refresh_token?: string;
}
