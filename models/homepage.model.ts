import { ProductModel } from './product.model';
import { Language } from './settings.model';

export interface HomepageListType {
  title: string;
  caption: string;
  model: string;
  download: string;
  transaction: string;
  rate: string;
  image_2d: string;
  image_360: string;
  arvr_video: string;
  items: { item_id: string; sort_id: number }[];
  market_homepage_languages: {
    id: string;
    title: string;
    caption: string;
    market_language: Language;
  }[];
}

export interface ProductFeaturedModel extends Pick<ProductModel, 'image' | 'title' | 'status'> {
  id: string;
  item_id: string;
  market_item: Pick<
    ProductModel,
    'id' | 'image' | 'title' | 'status' | 'is_temporary' | 'market_item_categories'
  >;
  sort_id: number;
  isUpdate?: boolean;
  id_delete?: string;
}

export interface TypeOptions {
  image?: string;
  label?: string;
  title: string;
  value: string;
  key: string;
  id?: string;
}

export interface ProductFeaturedPropsType {
  productFeatured: ProductFeaturedModel[];
  promiseDeleteProduct: ProductFeaturedModel[];

  setPromiseDeleteProduct: any;
  setProductFeatured: any;
}
