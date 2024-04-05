import { FormInstance } from 'antd';
import { typeImg } from 'models/category.model';

export type StepAction = {
  type: 'add' | 'edit' | 'view' | null;
  Step: StepType | null;
};

export type StepActionProps = {
  modalLists: {
    isShow: boolean;
    data: StepType | null;
    type: 'create' | 'edit' | 'delete' | '';
  };
  setModalLists: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      data: StepType | null;
      type: 'create' | 'edit' | 'delete' | '';
    }>
  >;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onFetchEditStep: (id: string, body: ParamsType) => void;
  // eslint-disable-next-line no-unused-vars
  onFetchCreateStep: (body: ParamsType) => void;
  onFetchDeleteStep: (id: string) => void;
  form: FormInstance;
  fileList: typeImg[];
  setFileList: React.Dispatch<React.SetStateAction<typeImg[]>>;
};

export type StepType = {
  createdAt: string;
  description: string;
  id: string;
  image: string;
  orderid: number;
  status: true;
  title: string;
  updatedAt: null;
};

export type StepProps = {
  loading: boolean;
  steps: StepType[] | null;
  setStep: React.Dispatch<React.SetStateAction<StepType[] | null>>;
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
  data: StepType | null;
  type: 'create' | 'edit' | 'delete' | '';
};
