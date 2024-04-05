import { Spin } from 'antd';
import { BodyStatusFeedback } from 'services/modeling-service/product-services';
import FeedbackComponent from './FeedbackComponent';
import { ModelProductFeedback } from 'models/modeling-landing-page-product';

import { PageContent } from 'styles/__styles';
import * as L from './style';

type Props = {
  type: 'view' | 'edit';
  feedbackId?: string;
  orderFeedbackDetail: ModelProductFeedback[];
  setOrderFeedbackDetail: React.Dispatch<React.SetStateAction<ModelProductFeedback[]>>;
  setSending: React.Dispatch<React.SetStateAction<boolean>>;
  sending: boolean;
  setFilter: React.Dispatch<React.SetStateAction<BodyStatusFeedback | undefined>>;
  filter?: BodyStatusFeedback;
};

const OrderUpdateFeedbackComponent = (props: Props) => {
  return (
    <L.OrderFeedbackComponent_wrapper>
      {props.orderFeedbackDetail.length !== 0 ? (
        <>
          {props.orderFeedbackDetail?.map((item) => {
            return (
              <>
                <PageContent>
                  <FeedbackComponent
                    data={item}
                    setSending={props.setSending}
                    sending={props.sending}
                    status={props.filter?.status}
                    setStatus={props.setFilter}
                  />
                </PageContent>
              </>
            );
          })}
        </>
      ) : (
        <PageContent>
          <Spin />
        </PageContent>
      )}
    </L.OrderFeedbackComponent_wrapper>
  );
};

export default OrderUpdateFeedbackComponent;
