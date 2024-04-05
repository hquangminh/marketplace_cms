import { FormInstance } from 'antd';
import { typeImg } from './category.model';

export type FaqAction = {
  type: 'add' | 'edit' | 'view' | null;
  Faq: FaqType | null;
};

export type FaqActionProps = {
  modalLists: {
    isShow: boolean;
    data: FaqType | null;
    type: 'create' | 'edit' | 'delete' | '';
  };
  setModalLists: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      data: FaqType | null;
      type: 'create' | 'edit' | 'delete' | '';
    }>
  >;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onFetchEditFaq: (id: string, body: ParamsType) => void;
  // eslint-disable-next-line no-unused-vars
  onFetchCreateFaq: (body: ParamsType) => void;
  onFetchDeleteFaq: (id: string) => void;
  form: FormInstance;
  fileList: typeImg[];
  setFileList: React.Dispatch<React.SetStateAction<typeImg[]>>;
};

export type FaqType = {
  id: string;
  question: string;
  answer: string;
  status: false;
  updatedAt: string;
  createdAt: string;
  orderid: number;
};

export type FaqProps = {
  loading: boolean;
  faqs: FaqType[] | null;
  setFaq: React.Dispatch<React.SetStateAction<FaqType[] | null>>;
};

export type ParamsType = {
  title: string;
  description: string;
  filename: string;
  image: string;
  filetype: string;
  status: true;
  orderid: number;
};

export type ModalLists = {
  isShow: boolean;
  data: FaqType | null;
  type: 'create' | 'edit' | 'delete' | '';
};
