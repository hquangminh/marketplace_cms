export type settingListType = {
  close: boolean;
  close_message: string;
  facebook: string;
  id: string;
  instagram: string;
  twitter: string;
  youtube: string;
};

export interface Language {
  id: string;
  image: string;
  language_code: string;
  language_name: string;
  is_default: boolean;
  status: boolean;
}
