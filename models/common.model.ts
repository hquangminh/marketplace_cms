import { PermissionType } from './auth.model';

export interface optionsType {
  idKey: string;
  parentKey: string;
  childrenKey: string;
}

export type PropsPageType = {
  auth?: {
    token: string;
    user: {
      id: string;
      image?: string;
      group: string;
      permis: PermissionType;
      status: boolean;
      name?: string;
      username: string;
      email?: string;
    };
  };
};

export type PageAllowActionType = {
  read?: boolean;
  readUser?: boolean;
  add?: boolean;
  list?: boolean;
  remove?: boolean;
};
