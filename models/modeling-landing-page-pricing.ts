import { typeImg } from './category.model';

export type PriceType = {
  id: string;
  title: string;
  description: {}[];
  status: boolean;
  orderid: number;
  createdAt: string;
  updatedAt: string;
  price: number;
  modeling_price_images: {
    price_id: string;
    id: string;
    link: string;
  }[];
};

export type ParamsType = {
  title: string;
  description: string[] | [];
  status: boolean;
  orderid: number;
  price: number;
  list_image: typeImg[];
  list_oldImage?: string[] | [];
};

export type PriceProps = {
  loading: boolean;
  prices: PriceType[] | null;
  setPrice: React.Dispatch<React.SetStateAction<PriceType[] | null>>;
};

export type PriceActionProps = {
  type?: 'edit' | 'view' | 'create';
  pricingDetail?: PriceType | null;
  setPricingDetail?: React.Dispatch<React.SetStateAction<PriceType | null>>;
  loading?: boolean;
};
