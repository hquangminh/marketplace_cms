import { FormInstance } from 'antd';
import { typeImg } from './category.model';

export type CustomerAction = {
  type: 'add' | 'edit' | 'view' | null;
  customer: CustomerType | null;
};

export type CustomerActionProps = {
  modalLists: {
    isShow: boolean;
    data: CustomerType | null;
    type: 'create' | 'edit' | 'delete' | '';
  };
  setModalLists: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      data: CustomerType | null;
      type: 'create' | 'edit' | 'delete' | '';
    }>
  >;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onFetchEditCustomer: (id: string, body: ParamsType) => void;
  // eslint-disable-next-line no-unused-vars
  onFetchCreateCustomer: (body: ParamsType) => void;
  onFetchDeleteCustomer: (id: string) => void;
  form: FormInstance;
  fileList: typeImg[];
  setFileList: React.Dispatch<React.SetStateAction<typeImg[]>>;
};

export type CustomerType = {
  createdAt: string;
  description: string;
  id: string;
  image: string;
  orderid: number;
  status: boolean;
  title: string;
  updatedAt: string;
  url: string;
};

export type CustomerProps = {
  loading: boolean;
  customers: CustomerType[] | null;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerType[] | null>>;
};

export type ParamsType = {
  title?: string;
  description?: string;
  filename?: string;
  image?: string;
  filetype?: string;
  status?: true;
  orderid?: number;
  oldImage?: string;
};

export type ModalLists = {
  isShow: boolean;
  data: CustomerType | null;
  type: 'create' | 'edit' | 'delete' | '';
};
