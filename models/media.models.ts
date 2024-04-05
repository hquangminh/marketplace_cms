export type mediaListType = {
  total: number;
  data: mediaType[] | [];
  error: boolean;
};

export type mediaType = {
  id: string;
  filename: string;
  url: string;
  user_id: string;
  createAt: string;
  filetype: string;
};

export type createModalComponentProps = {
  isShowModal: boolean;
  onClose: () => void;
  mediaList?: mediaType[] | any;
  setMediaList?: any;
};

export type ParamUploadType = {
  filename: string;
  image: string;
  filetype: string;
};
