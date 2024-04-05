import { typeImg } from './category.model';

export type ParamUploadType = {
  title: string;
  description: string;
  model: string;
  status: boolean;
  orderid: number;
  list_image: typeImg[];
  list_oldImage?: string[] | [];
  oldModel?: string;
  is_example?: boolean;
};

export type BannerDetailType = {
  createAt: string;
  description: string;
  id: string;
  model: string;
  orderid: number;
  status: boolean;
  title: string;
  modeling_banner_images: {
    banner_id: string;
    link: string;
    id: string;
    url: string;
  }[];
};
