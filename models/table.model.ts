import React from 'react';

import { ExpandableConfig } from 'antd/lib/table/interface';

type WidthColumn = {
  xxl?: number;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  span?: number;
};

export type DataSearch = {
  id?: string;
  parentid?: string;
  title: string;
  label: string;
  value: string | number;
  children?: DataSearch[];
};
export interface SearchModel {
  key?: string;
  title?: string;
  placeholder?: string;
  addonBefore?: string;
  addonAfter?: string;
  suffix?: React.ReactNode;
  value?: any;
  type:
    | 'input'
    | 'input-number'
    | 'input-group'
    | 'select'
    | 'select-multi'
    | 'tree-select-multi'
    | 'checkbox'
    | 'checkbox-group'
    | 'range-picker'
    | 'button';
  blockDateFuture?: boolean;
  width?: WidthColumn;
  wrapperClass?: string;
  data?: DataSearch[] | null | undefined;
  onChange?: (key: string | undefined, value: any) => void;
  onClick?: () => void;
  boxChildren?: SearchModel[];
  showTime?: boolean;
  showTimeFormat?: string;
}

export interface DataTablesProps {
  page?: number;
  loading?: boolean;
  columns: Array<object>;
  data: object[] | undefined;
  searchColumn?: SearchModel[];
  isPagination?: boolean;
  pageSize?: number;
  isChangePageSize?: boolean;
  total?: number;
  width?: number;
  rowKey: string;
  expandable?: ExpandableConfig<object>;
  listCategoryDisable?: string[];
  categoryDisableTitle?: string;
  onChangePage?: (value: number) => void;
  onChangePageSize?: (value: number) => void;
  onSearch?: (value: any) => void;
  onReset?: (value: any) => void;
}
