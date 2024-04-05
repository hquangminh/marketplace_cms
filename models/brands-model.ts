import { Dispatch, SetStateAction } from 'react';

export type BrandsAction = {
  type: 'add' | 'edit' | 'view' | null;
  Brands: BrandsType | null;
};

export type BrandsActionProps = {
  type?: 'edit' | 'view' | 'create';
  brandsDetail?: BrandsType | null;
  setBrandsDetail?: React.Dispatch<React.SetStateAction<BrandsType | null>>;
  loading?: boolean;
};

export type BrandsType = {
  id: string;
  title: string;
  image: string;
  status: false;
  website: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
};

export type BrandsProps = {
  loading: boolean;
  brands: BrandsType[] | null;
  setBrands: Dispatch<
    SetStateAction<{
      dataRender: BrandsType[];
      total: number;
    }>
  >;
  setLoading?: React.Dispatch<React.SetStateAction<boolean | undefined>> | any;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  total: number;
  page: number;
};

export type ParamsType = {
  title: string;
  status: false;
  website: string;
  contact: string;
  image: string;
  filename: string;
  filetype: string;
};

export type ModalLists = {
  isShow: boolean;
  data: BrandsType | null;
  type: 'create' | 'edit' | 'delete' | '';
};
