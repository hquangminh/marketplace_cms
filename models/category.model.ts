import { RcFile } from 'antd/es/upload';
import { PageAllowActionType } from './common.model';

export interface CategoryTree {
  id: string;
  title: string;
  children?: CategoryTree[];
}

export interface categoryPropsType {
  allowAction?: PageAllowActionType;
  categoryLists: categoryListsType[];
  loading: boolean;
  setCategory?: any;
  page?: 'category-blog' | 'help-category';
}

export interface categoryReducer {
  data: categoryListsType[];
  loading: boolean;
  loadingCreate: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  msg?: string;
}
export interface categoryListsType {
  key?: string;
  id?: string;
  title: string;
  description: string;
  icon?: string;
  orderid: number;
  level?: number;
  status?: boolean;
  parentid?: string;
  children?: categoryListsType[];
  isUpdate?: boolean;
  isShow?: boolean;
  market_helps_aggregate?: {
    aggregate: {
      count: number | null;
    };
  };
}

export interface parmUpload {
  id?: string;
  title: string;
  description: string;
  filename: string;
  icon: string;
  filetype: string;
  parentid: string;
  orderid: number;
  status: boolean;
  oldImage?: string;
}

export interface payloadType {
  parm: parmUpload;
  callBack: () => void;
  setExpandedKeys?: React.Dispatch<React.SetStateAction<any>>;
}

export interface payloadDeleteType {
  id: string;
  callBack: () => void;
  setActiveMenu: React.Dispatch<React.SetStateAction<any>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

export interface payloadUpdateType {
  id: string;
  parm: parmUpload;
}

export interface typeImg {
  name?: string;
  fileType?: any;
  id?: string;
  uid?: string;
  isUpdate?: boolean;
  image?: string;
  filetype?: string;
  filename?: string;
  fileUpload?: RcFile;
  old_image?: string;
  thumbUrl?: string;
  type?: string;
}

export interface categoryEditType {
  allowAction?: PageAllowActionType;
  onChangeData: any;
  dataTable: categoryListsType[];
  initialValueTree: categoryListsType;
  setDataTable: any;
  setActiveMenu: any;
  fileList: typeImg[] | any;
  setFileList: React.Dispatch<React.SetStateAction<typeImg[]>> | any;
  setExpandedKeys: any;
  valueEditor: string;
  setValueEditor: React.Dispatch<React.SetStateAction<string>> | any;
  categoryLists: categoryListsType[];
  setCategory: any;
  defaultFileList?: typeImg[] | any;
  setDefaultFileList?: React.Dispatch<React.SetStateAction<typeImg[]>> | any;
  onResetForm: () => void;
  page?: 'category-blog' | 'help-category' | '';
  setId: React.Dispatch<React.SetStateAction<string>>;
  setFilterDataTree: React.Dispatch<React.SetStateAction<categoryListsType[]>> | any;
}
