export type LicenseModel = {
  id: string;
  title: string;
  description: string;
  link: string;
  is_free: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type ModalLists = {
  isShow: boolean;
  data: LicenseModel | null;
  type: 'create' | 'view' | 'edit' | '';
};

export type ParamsType = {
  title: string;
  link: string;
  description: string;
  is_free: boolean;
};
