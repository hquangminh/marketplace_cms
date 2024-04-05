import { NextRouter } from 'next/router';

import { FormInstance } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { typeImg } from './category.model';

export interface listsTokenType {
  VRSTYLER_ADMIN_TOKEN: string;
  VRSTYLER_ADMIN_REFRESH_TOKEN: string;
}

export type FromEventNormFileType = {
  file: RcFile;
  name: string;
  form: FormInstance;
  setFileList:
    | React.Dispatch<React.SetStateAction<typeImg[]>>
    | React.Dispatch<React.SetStateAction<{ [key: string]: typeImg[] }>>
    | any;
  isUpdate: boolean;
  type?: string[];
  multiple?: boolean;
  typeUpload?: 'file';
  msgError?: string;
  ruleSize?: number;
  onSendModelToViewer?: (type: 'model' | 'cancel', e: any) => void;
};

export type CheckErrorApiMsgType = {
  status: number;
  router: NextRouter;
  content: string;
  error: any;
};
