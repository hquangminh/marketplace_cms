export type BannerModel = {
  createAt: Date;
  id: string;
  image: string;
  link: string;
  status: boolean;
  updateAt: Date;
};

export type ParamsType = {
  image: string;
  link: string;
  filename: string;
  filetype: string;
};

export type ModalLists = {
  isShow: boolean;
  data: BannerModel | null;
  type: 'create' | 'edit' | '';
};
