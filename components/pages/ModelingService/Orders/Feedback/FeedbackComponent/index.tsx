import { useEffect, useRef, useState } from 'react';

import { Avatar, InputRef, Comment, Input, Tooltip, Button, Image } from 'antd';
import { SendOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';

import commentFunction from 'common/functions/convertHTML';
import { urlPage } from 'common/constant';
import { onCheckErrorApiMessage, handlerMessage } from 'common/functions';

import productServices, { BodyStatusFeedback } from 'services/modeling-service/product-services';

import RenderStatusFeedbackComponent from '../Fragment/RenderStatusFeedback';
import MyImage from 'components/fragments/Image';
import { showConfirmDelete } from 'components/fragments/ModalConfirm';

import { ModelProductFeedback } from 'models/modeling-landing-page-product';

import * as L from './style';

type Props = {
  data: ModelProductFeedback | null;
  setSending: React.Dispatch<React.SetStateAction<boolean>>;
  sending: boolean;
  setStatus: React.Dispatch<React.SetStateAction<BodyStatusFeedback | undefined>>;
  status?: number;
};

const FeedbackComponent = (props: Props) => {
  const inputRef = useRef<InputRef>(null);
  const router = useRouter();

  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let url = window.location.href.split('#', -1);
    let target = url[url.length - 1].toLowerCase();
    let element = document.getElementById(target);
    element && element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const onSendFeedback = async () => {
    if (!content.trim()) {
      handlerMessage('Please enter feedback', 'warning');
      return;
    }
    props.setSending(true);
    await productServices
      .createFeedback(props.data?.id, { content: processContent(content) })
      .then((res) => {
        setContent('');
        props.setSending(res.data);
      })
      .catch((error: any) => {
        onCheckErrorApiMessage(error);
      });

    props.setSending(false);
  };

  const processContent = (content: string) => {
    return content
      .trim()
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replaceAll('\n', '<br/>')
      .replace(/\s+/g, '&nbsp;');
  };

  const onchangeStatusFeedbackApprove = async () => {
    let param: BodyStatusFeedback = {
      status: 2,
    };

    await productServices
      .updateStatusFeedback(props.data?.id, param)
      .then((res) => {
        props.setStatus({
          ...res.data,
          status: param.status,
        });
      })
      .catch((error: any) => {
        if (error.data.error_code === 'FEEDBACK_IS_FULFILLED') {
          router.push('/modeling-service/orders/feedback');
        } else onCheckErrorApiMessage(error);
      });

    props.setSending(false);
  };

  const onchangeStatusFeedbackReject = async () => {
    let param: BodyStatusFeedback = { status: 4 };

    await productServices
      .updateStatusFeedback(props.data?.id, param)
      .then((res) => {
        props.setStatus({
          ...res.data,
          status: param.status,
        });
      })
      .catch((error: any) => {
        if (error.data.error_code === 'FEEDBACK_IS_FULFILLED') {
          router.push('/modeling-service/orders/feedback');
        } else onCheckErrorApiMessage(error);
      });

    props.setSending(false);
  };

  const confirmApprove = () => {
    showConfirmDelete(
      props.data?.id as string,
      onchangeStatusFeedbackApprove,
      'Are you sure change approve?'
    );
  };

  const confirmReject = () => {
    showConfirmDelete(
      props.data?.id as string,
      onchangeStatusFeedbackReject,
      'Are you sure change reject?'
    );
  };

  return (
    <L.FeedbackComponent_wrapper>
      <h3 className='order-modeling-feedback-total' id={props.data?.id}>
        <div className='status__feedback'>
          <div className='title__feedback'>
            <h3 className='title'>Status:</h3>
            <p className='content'>{RenderStatusFeedbackComponent(props.data?.status as number)}</p>
          </div>
          {props.data?.status === 1 && (
            <div className='button__feedback'>
              <Button type='primary' className='btn-feedback mr-3' onClick={confirmApprove}>
                Approve
              </Button>
              <Button type='primary' danger className='btn-feedback' onClick={confirmReject}>
                Reject
              </Button>
            </div>
          )}
        </div>
      </h3>
      <div className='feedback__header'>
        <Comment
          actions={[
            <span key='reply' onClick={() => inputRef.current?.focus()}>
              {props.data?.status === 1 ? 'Reply to' : ''}
            </span>,
          ]}
          author={
            <Link href={urlPage.userDetail.replace('{id}', props.data?.market_user?.id || '')}>
              <a>{props.data?.market_user.name}</a>
            </Link>
          }
          avatar={
            <Link href={urlPage.userDetail.replace('{id}', props.data?.market_user?.id || '')}>
              <a>
                <Avatar
                  src={
                    <MyImage
                      src={props.data?.market_user.image || ''}
                      imgErr='/static/images/avatar-default.png'
                    />
                  }
                  alt={props.data?.market_user.nickname}
                />
              </a>
            </Link>
          }
          content={
            <L.Feedback__Content>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: commentFunction(props.data?.content || '') }}
              />
              <div className='order-modeling-product-feedback-item-attachment'>
                <Image.PreviewGroup>
                  {props.data?.modeling_product_feedback_files?.map((file) => (
                    <Image
                      width={80}
                      src={file.link}
                      alt={file.file_name}
                      key={file.id}
                      preview={{ mask: <EyeOutlined /> }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </L.Feedback__Content>
          }
          datetime={
            <Tooltip title={moment(props.data?.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
              {moment(props.data?.createdAt).fromNow()}
            </Tooltip>
          }>
          {props.data?.modeling_product_feedbacks?.map((reply) => (
            <>
              <Comment
                actions={[
                  <span key='reply' onClick={() => inputRef.current?.focus()}>
                    {props.data?.status === 1 ? 'Reply to' : ''}
                  </span>,
                ]}
                key={reply.id}
                author={
                  <Link href={urlPage.userDetail.replace('{id}', reply.market_user?.id || '')}>
                    <a>{reply.market_user?.name}</a>
                  </Link>
                }
                avatar={
                  <Link href={urlPage.userDetail.replace('{id}', reply.market_user?.id || '')}>
                    <a>
                      <Avatar
                        src={
                          <MyImage
                            src={reply.market_user?.image}
                            imgErr='/static/images/avatar-default.png'
                          />
                        }
                        alt={props.data?.market_user.nickname}
                      />
                    </a>
                  </Link>
                }
                content={
                  <L.Feedback__Content>
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: commentFunction(reply.content),
                      }}
                    />
                    <div className='order-modeling-product-feedback-item-attachment'>
                      <Image.PreviewGroup>
                        {reply.modeling_product_feedback_files?.map((file) => (
                          <Image
                            width={80}
                            src={file.link}
                            alt={file.file_name}
                            key={file.id}
                            preview={{ mask: <EyeOutlined /> }}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </L.Feedback__Content>
                }
              />
            </>
          ))}
        </Comment>
      </div>
      {props.data?.status === 1 && (
        <div className='input__text'>
          <Input.TextArea
            ref={inputRef}
            autoSize
            bordered={false}
            placeholder='Input feedback'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button loading={props.sending} onClick={onSendFeedback}>
            <SendOutlined />
          </Button>
        </div>
      )}
    </L.FeedbackComponent_wrapper>
  );
};

export default FeedbackComponent;
