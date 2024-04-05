import React from 'react';
import { PageAllowActionType } from './common.model';
import { Language } from './settings.model';

export type SeoModel = {
  id: string;
  image: string;
  title: string;
  page: string;
  descriptions: string;
  keywords: string;
  language_id: string;
  market_language: Language;
  market_seo_languages: SeoModel[];
};

export interface SeoComponentType {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean | undefined>> | any;
  data?: SeoModel[] | null;
  seoDetail?: SeoModel | null;
  setSeoList?: React.Dispatch<React.SetStateAction<SeoModel>> | any;
  seoID?: string | string[] | undefined;
  seoType?: string;
  allowAction?: PageAllowActionType;
}
