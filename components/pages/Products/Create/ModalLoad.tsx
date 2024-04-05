import { Alert, Badge, Button, FormInstance, Modal, Progress } from 'antd';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { CheckOutlined, SyncOutlined } from '@ant-design/icons';

import { urlPage } from 'common/constant';

import {
  CateBrandErrorList,
  ModalListsDataType,
  ProductModel,
  currentFile3D,
} from 'models/product.model';

import styled from 'styled-components';

type Props = {
  modalLists: {
    isShow: boolean;
    data: ModalListsDataType[] | [];
    currentFiles: currentFile3D;
  };
  productId: string;
  form: FormInstance;
  cateBrandErrorList: CateBrandErrorList | null;
  statusLists: {
    total: number;
    pending: number;
    success: number;
    error: number;
  };
  loading: boolean;
  isDraft: boolean;
  onResetData: () => void;
  productDetail?: ProductModel | null;
  isUpdate?: boolean;
};

const ModalLoadComponent = (props: Props) => {
  const {
    modalLists,
    statusLists,
    productId,
    isDraft,
    cateBrandErrorList,
    onResetData,
    productDetail,
    isUpdate,
  } = props;
  const router = useRouter();

  return (
    <ModalLoadComponent_wrapper
      title='Upload'
      centered
      width={800}
      visible={modalLists.isShow}
      closable={false}
      zIndex={999999}
      destroyOnClose={true}
      footer=''>
      <div className='item__wrapper'>
        {modalLists.data?.map((item, index) => (
          <div className={`item ${item.error.status === 'error' ? 'error' : ''}`} key={index}>
            <h3>
              {item.name}
              <span>{item.size}</span>
            </h3>

            <div className='progress__wrapper'>
              <div className='inner'>
                <div className='progress__group'>
                  <span className='title'>Check: </span>
                  <Progress percent={item.loadingUploadPresigned} />
                </div>

                <div className='progress__group'>
                  <span className='title'>
                    <abbr title='If your internet speed is fast, you can skip this step.'>
                      Processing (?):
                    </abbr>
                  </span>
                  <Progress percent={item.loadingUploadFile} />
                </div>

                <div className='progress__group'>
                  <span className='title'>Upload: </span>{' '}
                  <Progress percent={item.loadingUploadProduct} />
                </div>

                <div className='progress__group'>
                  <span className='title'>Status: </span>
                  {(item.error.status === 'pending' && (
                    <Alert message='Pending' type='info' showIcon icon={<SyncOutlined />} />
                  )) ||
                    (item.error.status === 'success' && (
                      <Alert message='Success' type='success' showIcon />
                    )) ||
                    (item.error.status === 'error' && (
                      <Alert message={item.error.msg} type='error' showIcon />
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='total__group'>
        {modalLists.data.length > 0 && (
          <>
            <h4>
              Total: {modalLists.data.length}{' '}
              {modalLists.data.length > 1 ? 'files uploaded' : 'file uploaded'}
            </h4>

            {(!isDraft && isUpdate && productDetail?.status !== 1) || (!isUpdate && !isDraft) ? (
              <div className='note'>
                <Badge dot status='warning' /> if there is an eror whilte uploading the product, the
                status will be draft
                <br />
                <Badge dot status='warning' /> If all successful then status will be published
              </div>
            ) : (
              ''
            )}

            <div className='total__group--box'>
              <Alert
                message={`Pending: ${statusLists.pending}`}
                type='info'
                showIcon
                icon={<SyncOutlined />}
              />
              <Alert message={`Success: ${statusLists.success}`} type='success' showIcon />
              <Alert message={`Error: ${statusLists.error}`} type='error' showIcon />
              <Alert
                message={`Status: ${
                  (statusLists.error && !statusLists.pending && !isUpdate) ||
                  isDraft ||
                  (statusLists.error && !statusLists.pending && isUpdate) ||
                  cateBrandErrorList?.isError
                    ? ' Draft'
                    : 'Publish'
                }`}
                type='warning'
                showIcon
                icon={<CheckOutlined />}
              />
            </div>
          </>
        )}

        {cateBrandErrorList?.isError && (
          <div className='warning__upload'>
            <Alert
              message={`An error occurred during the product upload${
                !isDraft ? `, the product's status is draft` : ''
              }`}
              description={
                <>
                  {cateBrandErrorList?.cate.length > 0 ? (
                    <p>
                      <span className='error__text'>Error: </span>
                      Category{' '}
                      <span className='warning__text'>
                        {cateBrandErrorList?.cate.map(
                          (cate, idx) =>
                            cate + (cateBrandErrorList?.cate.length === idx + 1 ? ' ' : ', ')
                        )}
                      </span>
                      has been changed by the owner or does not exist
                    </p>
                  ) : (
                    ''
                  )}

                  {cateBrandErrorList.brand ? (
                    <p>
                      <span className='error__text'>Error: </span>
                      Brand <span className='warning__text'>{cateBrandErrorList.brand}</span> has
                      been changed by the owner or does not exist
                    </p>
                  ) : (
                    ''
                  )}
                </>
              }
              type='warning'
            />
          </div>
        )}
        <hr className='mt-0' />

        <div className='total__group--btn'>
          <>
            {!statusLists.pending ? (
              <Button type='ghost'>
                <Link href={urlPage.productNewest}>
                  <a>Back to lists</a>
                </Link>
              </Button>
            ) : (
              ''
            )}

            {!statusLists.pending && !statusLists.error && !isDraft && !isUpdate ? (
              <Button
                type='primary'
                onClick={() => {
                  onResetData();
                }}>
                Create new
              </Button>
            ) : (
              ''
            )}

            {statusLists.error && statusLists.pending === 0 && !isDraft && !isUpdate ? (
              <Button type='primary' onClick={() => router.push(`/products/edit/${productId}`)}>
                Edit to publish
              </Button>
            ) : (
              ''
            )}
          </>
        </div>
      </div>
    </ModalLoadComponent_wrapper>
  );
};

const ModalLoadComponent_wrapper = styled(Modal)`
  .ant-modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 500px;
    overflow-y: auto;
    padding-bottom: 0;
    padding-top: 12px;
  }

  .item__wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ant-alert {
    padding: 0px 10px;
  }

  .note {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .total__group {
    box-shadow: 0px 1px 4px #0000005c;
    margin: 0 -24px;
    background-color: mintcream;

    padding: 10px 24px;
    position: sticky;
    bottom: 0;
    left: 0;
    background-color: #fff;

    .ant-tag {
      padding: 4px 10px;
      font-size: 14px;
    }

    &--box {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
    }

    &--btn {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }

    h4 {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
    }
  }

  .item {
    padding: 5px;
    padding-bottom: 20px;

    &:not(:last-child) {
      border-bottom: 1px solid #d9d9d9;
    }

    &:last-child {
      padding-bottom: 0;
    }

    h3 {
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 10px;

      span {
        font-weight: 400;
        opacity: 0.7;
      }
    }

    .icon__close {
      margin-left: 15px;
      position: relative;
      top: 2px;
      font-size: 15px;
      cursor: pointer;
      text-align: right;
      background-color: #f5e5e5;
      padding: 5px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: red;
    }

    .progress__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .inner {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }

    .progress__group {
      display: flex;
      align-items: center;
      gap: 10px;
      white-space: nowrap;
      margin-bottom: 5px;

      .title {
        min-width: 80px;
        font-size: 12px;

        abbr {
          cursor: initial;
          text-decoration: initial;
        }
      }
    }

    &.error {
      color: red;

      h3 {
        color: red;

        span {
          color: red;
        }
      }
    }
  }

  .error__text {
    color: #ff4d4f;
    font-weight: 500;
  }

  .warning__upload {
    margin-bottom: 20px;

    .warning__text {
      font-weight: 700;
    }

    h3 {
      font-size: 16px;
    }
  }
`;

export default ModalLoadComponent;
