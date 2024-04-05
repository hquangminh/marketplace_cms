export type ShowroomType = {
  id: string;
  name: string;
  nickname: string;
  email: string;
  regtype: string;
  status: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  market_orders_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

export type ShowroomUpdate = {
  id: string;
  email: string;
  username: string;
  name: string;
  image?: string;
  filename?: string;
  filetype?: string;
};

export type ShowroomActionProps = {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean | undefined>> | any;
  type?: 'edit' | 'view' | 'create';
  showroomDetail?: ShowroomType | null;
  setShowroomDetail?: React.Dispatch<React.SetStateAction<ShowroomType | null>>;
};
