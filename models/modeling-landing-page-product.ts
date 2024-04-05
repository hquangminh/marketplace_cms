export type ModelProductFileAttach = {
  id: string;
  link: string;
  file_name: string;
  product_id: string;
};
export type ModelProductFeedback = {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: 1 | 2 | 3 | 4;
  product_id: string;
  market_user: {
    id: string;
    nickname: string;
    image: string;
    name: string;
  };
  modeling_product: {
    id: string;
    image: string;
    modeling_order: {
      id: string;
      order_no: string;
    };
    name: string;
    price: string;
  };
  modeling_product_feedback_files: [
    {
      id: string;
      link: string;
      file_type: string;
      file_name: string;
    }
  ];
  modeling_product_feedbacks: [
    {
      id: string;
      createdAt: string;
      updatedAt: string;
      content: string;
      status: 1 | 2 | 3 | 4;
      product_id: string;
      parentid: string;
      market_user: {
        id: string;
        nickname: string;
        image: string;
        name: string;
      };
      modeling_product_feedback_files: [
        {
          file_name: string;
          file_type: string;
          id: string;
          link: string;
        }
      ];
    }
  ];
};

export type ModelingListFeedback = {
  id: string;
  createdAt: string;
  content: string;
  is_replied: boolean;
  status: 1 | 2 | 3 | 4;
  modeling_product: {
    id: string;
    name: string;
    price: number;
    modeling_order: {
      id: string;
      order_no: string;
    };
  };
};
