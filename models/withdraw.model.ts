import { BodyFilterWithdraw } from './../services/withdraw-services';
import { Dispatch, SetStateAction } from 'react';

export type WithdrawModel = {
  id: string;
  order_no: number;
  createdAt: string;
  updatedAt: string;
  account_name: string;
  card_number: string;
  swift_code: string;
  bank_name: string;
  amount: number;
  status: number;
  reason: string | null;
  image: string;
  user_id: string;
  market_user: {
    nickname: string;
    name: string;
    email: string;
  };
  transaction_id: string;
};

export type UpdateWithdraw = {
  status: number;
  reason: string;
  image: string;
  filename?: string;
  filetype?: string;
  oldImage?: string;
  transaction_id?: string;
};

export type WithDrawActionProps = {
  isShowModal: boolean;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean | undefined>> | any;
  withdraw?: WithdrawModel;
  onClose: () => void;
  onUpdate: (withDrawId: string, withdraw: WithdrawModel) => void;
};

export type WithDrawCreateComponentProps = {
  filter: BodyFilterWithdraw;
  withdraws: WithdrawModel[] | null;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean | undefined>> | any;
  page: number;
  pageSize: number;
  setData?: React.Dispatch<React.SetStateAction<WithdrawModel>> | any;
  total: number;
  onUpdate: (withDrawId: string, withdraw: WithdrawModel) => void;
  onChangeFilter: Dispatch<
    SetStateAction<{
      page: number;
      status?: number | undefined;
      isExcel?: boolean | undefined;
      start_date?: string;
      end_date?: string;
    }>
  >;
};
