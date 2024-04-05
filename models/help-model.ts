import React from 'react';
import { categoryListsType } from 'models/category.model';
import { PageAllowActionType } from './common.model';

export type DataHelpType = {
  id: string;
  title: string;
  content: string;
  sort_id: number;
  status: boolean;
  market_category_help: categoryListsType;
};

export type HelpComponentProps = {
  data: DataHelpType[];
  loading: boolean;
  allowAction: PageAllowActionType;
  listCategoryDisable: string[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DataHelpType[]>>;
  setFilterList: React.Dispatch<React.SetStateAction<{ title?: string; category?: string }>>;
};

export type HelpCreateComponentProps = {
  data?: DataHelpType | null;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>> | any;
  helpID?: string | string[] | undefined;
  helpType?: string;
  allowAction: PageAllowActionType;
};

export type ParamUpload = {
  status: boolean;
  title: string;
  content: string;
  sort_id: number;
  category_id: string;
};
