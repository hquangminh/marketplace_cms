import { FormInstance } from 'antd';

import { typeImg } from './category.model';
import { PageAllowActionType } from './common.model';
import { Language } from './settings.model';
import { ProductModel } from './product.model';

export type BlogDataItem = {
  link: string;
  image: string;
  title: string;
  price: number;
  old_price?: number;
};

export type BlogData = {
  id: string;
  name: string;
  title: string;
  content: string;
  image: string;
  banner?: string;
  hashtag: string[];
  items: BlogDataItem[];
  sumary?: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
  is_publish: boolean;
  market_category_blog?: BlogCategory;
  market_language: Language;
  market_blog_languages: BlogData[];
  market_blog_items: { market_item: ProductModel }[];
  createAt: string;
  publish_date?: string;
};

export type BlogCategory = { id: string; orderid: number; status: true; title: string };

export type BlogListComponentProps = {
  data: BlogData[];
  allowAction: PageAllowActionType;
  loading: boolean;
  setData: React.Dispatch<React.SetStateAction<BlogData[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeSearch: (value: string) => void;
};

export type BlogCreateComponentProps = {
  data?: BlogData;
  loading?: boolean;
  blogType: string;
  blogID?: string | string[] | undefined;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>> | any;
  allowAction: PageAllowActionType;
};

export type BlogInformationProps = {
  fileList: {
    [key: string]: typeImg[];
  };
  setFileList: React.Dispatch<React.SetStateAction<{ [key: string]: typeImg[] }>>;
  form: FormInstance;
  blogType: string;
};

export type BlogContentProps = {
  valueEditor: string;
  setValueEditor: React.Dispatch<React.SetStateAction<string>>;
  blogType: string;
  form: FormInstance;
};

export type BodyParms = {
  title: string;
  orderid: number;
  status: boolean;
};
