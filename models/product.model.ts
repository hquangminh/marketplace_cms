import { RcFile } from 'antd/es/upload';

import { PageAllowActionType } from './common.model';

import { typeImg } from './category.model';

export type FormatFiles =
  | 'FBX'
  | 'MAX'
  | 'MB'
  | 'BLEND'
  | 'STL'
  | 'GOZ'
  | 'SPP'
  | 'GLB'
  | 'USDZ'
  | 'GLTF'
  | 'OBJ'
  | 'DEMO';

export interface FormatFileType {
  [FormatFiles: string]: typeImg[] | any;
}

export interface GeoMetryType {
  quads: string;
  triangles: string;
  total_triangles: string;
}

export type Config3DModelType = {
  behindLight: string;
  behindLightIntensity: number;
  bottomLight: string;
  bottomLightIntensity: number;
  frontLight: string;
  frontLightIntensity: number;
  leftLight: string;
  leftLightIntensity: number;
  rightLight: string;
  rightLightIntensity: number;
  topLight: string;
  topLightIntensity: number;
  environment: string;
  background: string;
};

export type ItemType = {
  cat_id: string;
  id: string;
  image: string;
  old_price: number;
  price: number;
  tittle: number;
};

export interface ProductModel {
  id: string;
  title: string;
  image: string;
  price: number;
  is_animated: boolean;
  is_pbr: boolean;
  is_rigged: boolean;
  is_uv: boolean;
  market_item_categories: {
    market_category: {
      id: string;
      title: string;
      status: boolean;
    };
  }[];
  old_price: number | any;
  dimensions?: string;
  materials: string;
  color: string;
  description: string;
  geometry: GeoMetryType;
  textures: string;
  vertices: string;
  quads: string;
  total_triangles: string;
  file_details: string[];
  isUpdate?: boolean;
  files: FormatFileType | any;
  market_likes_aggregate?: any;
  market_item_galleries?: ImageType[];
  market_category?: {
    id: string;
    icon: string;
    title: string;
  };
  seo_title?: string;
  seo_description?: string;
  viewer_bg: string;
  totalComment: {
    aggregate: {
      count: number;
    };
  };
  market_license?: {
    id: string;
    description: string;
    is_free: boolean;
    link: string;
    title: string;
  };
  status: StatusProduct;
  totalReviews: {
    aggregate: {
      count: number;
    };
  };
  avgReview: number;
  unit: number;
  brand_id: string;
  sell_price: number;
  link: string;
  item_no: string;
  config_3d_viewer?: Config3DModelType;
  market_brand: {
    id: string;
    status: boolean;
    title: string;
  };
  is_temporary?: boolean;
}
export interface ProductComponentType {
  allowAction?: PageAllowActionType;
  loading?: boolean;
  products: ProductModel[] | null;
  totalProducts?: number;
  pageSize?: number;
  onSearch?: (value: any) => void;
  setProducts?: React.Dispatch<React.SetStateAction<ProductModel[] | any>> | undefined | any;
}

export interface optionsType {
  value: string;
  key: string;
  disabled?: boolean;
}

export interface ImageType {
  id: string;
  image: string;
}

export interface GalleryProps {
  galleryLists: typeImg[];
  setGalleryLists: React.Dispatch<React.SetStateAction<typeImg>> | any;
  onRemoveGallery: (file: typeImg) => void;
}

export type ErrType = {
  err: boolean;
  checkErrGallery: string[];
  checkErrModel: string[];
  checkErrDEMO: string[];
};

export interface DescriptionComponentProps {
  onChangeEditor: (value: string) => void;
  valueEditor: string;
  type?: 'view' | '';
}

export type ModalListsDataType = {
  key: any;
  name: string;
  size: string;
  loadingUploadPresigned: number;
  loadingUploadFile: number;
  loadingUploadProduct: number;
  error: {
    status: 'success' | 'error' | 'pending';
    msg: string;
  };
};

export type ParamUploadProduct = {
  title: string;
  cat_ids: string;
  description?: string;
  file_details: FormatFiles[] | string[] | any;
  files: {
    [FormatFiles: string]: string;
  };
  filetype?: string;
  geometry: GeoMetryType | {};
  image?: string;
  is_animated: boolean;
  is_pbr: boolean;
  is_rigged: boolean;
  is_uv: boolean;
  license_id: string;
  price: number;
  status: 1 | 5;
  materials?: string;
  vertices?: string;
  textures: string;
  filename?: string;
  old_price?: number;
  seo_title: string;
  seo_description: string;
  unit: number;
  old_image?: string;
  brand_id: string;
  config_3d_viewer?: Config3DModelType | {};
  viewer_bg?: string;
  sell_price: number;
  link: string;
  item_no: string;
};

export type ParamUploadS3 = {
  filename?: string;
  kind?: 'public' | 'private';
  fileUpload?: RcFile;
  url?: string;
  download?: string;
  download_usdz?: string;
};

export type OptionSelect = {
  value: string;
  label: string;
  image?: string;
  is_free?: boolean;
};

export type currentFile3D = {
  files: {
    [key: string]: string;
  };
  file_details: string[];
};

export type CateBrandErrorList = {
  cate: string[];
  brand: string;
  isError: boolean;
};

export const enum StatusProduct {
  PUBLISH = 1,
  DRAFT = 5,
  HIDE = 7,
}
