import { PermissionType } from './auth.model';

export type AdministratorProps = {
  loading: boolean;
  users: AdministratorType[] | undefined;
  setUser: React.Dispatch<React.SetStateAction<AdministratorType[] | any>> | undefined | any;
};

export type AdministratorType = {
  id: string;
  username: string;
  email: string;
  name: string;
  group: string;
  permis: PermissionType[];
  status: boolean;
};

export interface DataAdminAccount {
  name?: string;
  old_password?: string;
  username?: string;
  password?: string;
  image?: string | null;
  filename?: string;
  filetype?: string;
  email?: string;
  permis?: any;
  status?: boolean;
  confirm_password?: string;
  account_type?: string;
  role?: string;
  group?: string;
}

export interface PropsAddComponent {
  accountId?: string;
  accountDetail?: DataAdminAccount;
  loading?: boolean;
}
