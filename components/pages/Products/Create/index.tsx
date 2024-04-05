import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import axios from 'axios';

// prettier-ignore
import { Button, Col, Form, Row } from 'antd';

import config from 'config';

// prettier-ignore
import { convertParamsUrlProduct, handlerMessage, onCheckErrorApiMessage, onToastNoPermission, renderFileSize, } from 'common/functions';
import { urlPage } from 'common/constant';

import productServices from 'services/product-services';
import uploadFileServices from 'services/uploadFile-services';

import Loading from 'components/fragments/Loading';
import ModelPlay from 'components/fragments/ModelPlay/ModelPlay';
import Inspect3DModelsComponent from './Inspect3DModels';
import Includes3DFormatsComponent from './Includes3DFormats';
import MainComponent from './Main';
import SeoComponent from './Seo';
import PreviewModelComponent from './PreviewModel';
import DescriptionComponent from './Descriptions';
import ModalLoadComponent from './ModalLoad';
import BrandsComponent from './Brands';

import {
  CateBrandErrorList,
  Config3DModelType,
  FormatFiles,
  ModalListsDataType,
  ParamUploadProduct,
  ProductModel,
  currentFile3D,
} from 'models/product.model';
import { typeImg } from 'models/category.model';
import { PageAllowActionType } from 'models/common.model';

import * as L from './style';
import convertFileName from 'common/functions/convertFileName';

type Props = {
  productDetail?: ProductModel | null;
  loadingGetDetail?: boolean;
  id?: string;
  isUpdate?: boolean;
  allowAction?: PageAllowActionType;
  type?: 'view' | '';
};

const ProductAddComponent = (props: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { productDetail, loadingGetDetail, id } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [valueEditor, setValueEditor] = useState<string>('');
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const [fileLists, setFileLists] = useState<{ [key: string]: typeImg[] }>({});

  const [fileDetails, setFileDetails] = useState<string[]>([]);

  const [srcViewer, setSrcViewer] = useState(config.urlModelViewer);

  const [productId, setProductId] = useState<string | ''>(id || '');

  // Lưu lỗi trong lúc up file thay đổi status của category, brand
  const [cateBrandErrorList, setCateBrandErrorList] = useState<CateBrandErrorList | null>(null);

  // Lưu số lượng trạng thái lúc up file
  const [statusLists, setStatusLists] = useState<{
    total: number;
    pending: number;
    success: number;
    error: number;
  }>({ total: 0, pending: 0, success: 0, error: 0 });

  // Thông tin modal hiển thị lúc úp file
  const [modalLists, setModalLists] = useState<{
    isShow: boolean;
    data: ModalListsDataType[] | [];
    currentFiles: currentFile3D;
  }>({ isShow: false, data: [], currentFiles: {} as currentFile3D });

  const [configs3DViewer, setConfigs3DViewer] = useState<Config3DModelType>();

  // Onchange iframe model
  useEffect(() => {
    const onChangeEnvironmentModel = (config: Record<string, any>) => {
      const { environment, lighting, background } = config;

      setConfigs3DViewer((prevState: any) => {
        const newObj = {
          ...prevState,
          environment: environment || prevState?.environment || '',
          ...lighting,
          background: background || prevState?.background || '',
        };
        if (!background && !prevState?.background) {
          delete newObj['background'];
        }

        return newObj;
      });
    };
    window.addEventListener('message', (e) => onChangeEnvironmentModel(e.data), false);
  }, []);

  //check error với status false của cat_ids vs brand_id
  const checkStatusFalseCategoryBrand = () => {
    const isCategoryError = productDetail?.market_item_categories.some((item) => {
      const catIds = item.market_category.status;
      return !catIds;
    });

    const brandFalse = productDetail?.market_brand !== null && !productDetail?.market_brand?.status;

    const errors = [];

    if (isCategoryError && productDetail !== undefined) {
      errors.push({ name: 'cat_ids', errors: [`This category does not exist`] });
    }
    if (brandFalse && productDetail?.market_brand != null) {
      errors.push({ name: 'brand_id', errors: ['This brand does not exist'] });
    }

    form.setFields(errors);
  };

  // Set default value form
  useEffect(() => {
    if (productDetail && Object.keys(productDetail).length > 0) {
      const upperText = productDetail.file_details.map((file: string) => file.toUpperCase());

      setFileDetails(upperText);

      for (const key in productDetail.files) {
        setFileLists((prevState) => ({
          ...prevState,
          [key]: [
            {
              uid: '',
              name: productDetail.files[key].split('/').slice(-1)[0],
              url: productDetail?.files[key] || '',
              filename: productDetail.files[key].split('/').slice(-1)[0],
              image: productDetail?.files[key] || '',
              filetype: productDetail.files[key]?.type || '',
            },
          ],
        }));
        form.setFieldsValue({
          [key]: [
            {
              uid: '',
              name: productDetail.files[key].split('/').slice(-1)[0],
              url: productDetail?.files[key] || '',
              filename: productDetail.files[key].split('/').slice(-1)[0],
              image: productDetail?.files[key] || '',
              filetype: productDetail.files[key]?.type || '',
            },
          ],
        });
      }

      setFileLists((prevState) => ({
        ...prevState,
        image: [
          {
            uid: '',
            name: productDetail.image?.split('/').slice(-1)[0],
            url: productDetail?.image || '',
            filename: productDetail?.image?.split('/').slice(-1)[0],
            image: productDetail?.image || '',
            filetype: '',
          },
        ],
      }));

      form.setFieldsValue({
        title: productDetail.title,
        price: productDetail.price,
        old_price: productDetail.old_price || null,
        dimensions: productDetail.dimensions,
        materials: productDetail.materials,
        cat_ids:
          productDetail.market_item_categories.length > 0
            ? productDetail.market_item_categories?.map((item) =>
                item.market_category.status ? item.market_category.id : item.market_category.title
              )
            : [],
        color: productDetail.color ? productDetail.color?.split(',') : [],
        textures: productDetail.textures,
        vertices: productDetail.vertices,
        quads: productDetail.geometry?.quads,
        total_triangles: productDetail.geometry?.total_triangles,
        triangles: productDetail.geometry?.triangles,
        file_details: productDetail.file_details?.map((item: string) => item.toUpperCase()),
        is_animated: productDetail.is_animated,
        is_pbr: productDetail.is_pbr,
        is_rigged: productDetail.is_rigged,
        license_id: productDetail.market_license?.id,
        is_uv: productDetail.is_uv,
        image: productDetail.image
          ? [
              {
                uid: '',
                name: productDetail.image?.split('/').slice(-1)[0],
                url: productDetail?.image || '',
                filename: productDetail.image?.split('/').slice(-1)[0],
                image: productDetail?.image || '',
                filetype: '',
              },
            ]
          : undefined,
        seo_description: productDetail.seo_description,
        seo_title: productDetail.seo_title,
        unit: productDetail.unit,

        isFree: productDetail.price === 0,
        isUpdate: true,
        brand_id: !productDetail.market_brand?.status
          ? productDetail.market_brand?.title
          : productDetail.brand_id,
        sell_price: productDetail.sell_price,
        link: productDetail.link,
        item_no: productDetail.item_no,
      });

      setConfigs3DViewer(productDetail?.config_3d_viewer);

      setIsDraft(productDetail?.status === 5 ? true : false);

      setValueEditor(productDetail?.description);

      if (productDetail.files.DEMO) {
        setSrcViewer(
          config.urlModelViewer +
            '/' +
            productId +
            '?' +
            convertParamsUrlProduct({
              background: productDetail.viewer_bg,
              ...productDetail.config_3d_viewer,
            })
        );
      }
    }
    // Gọi hàm checkErrors và lấy danh sách lỗi của category vs brand
    checkStatusFalseCategoryBrand();
  }, [productDetail]);

  useEffect(() => {
    form.setFields([{ name: 'checkErrModel', errors: [] }]);
  }, [fileLists]);

  // Function show % up file
  const onConfigAxios = (
    progressEvent: any,
    loadingUpload: 'loadingUploadPresigned' | 'loadingUploadFile' | 'loadingUploadProduct',
    key: FormatFiles | string
  ) => {
    const { loaded, total } = progressEvent;
    const percentage = Math.floor((loaded * 100) / total);

    if (percentage % 10 === 0) {
      setModalLists((prevState) => ({
        ...prevState,
        data: prevState.data.map((item) =>
          item.key === key ? { ...item, [loadingUpload]: percentage } : item
        ),
      }));
    }
  };

  // Function check lỗi category, brand trong lúc up file change status
  const onCheckCateBrandError = (data: ProductModel, currentError: CateBrandErrorList) => {
    data.market_item_categories?.forEach((c) => {
      if (!c.market_category.status && !currentError.cate?.includes(c.market_category.title)) {
        currentError.cate?.push(c.market_category.title);
        currentError.isError = true;
      }

      if (
        data.market_brand?.title &&
        !data.market_brand?.status &&
        currentError.brand !== data.market_brand?.title
      ) {
        currentError.brand = data.market_brand.title;
        currentError.isError = true;
      }
    });
  };

  const onFinish = async (values: any) => {
    if (!isDraft) {
      if (fileDetails.length === 0 && !isDraft) {
        form.setFields([{ name: 'checkErrModel', errors: ['Please upload at least 1 model'] }]);
        form.scrollToField(['checkErrModel'], {
          behavior: (actions) =>
            // list is sorted from innermost (closest parent to your target) to outermost (often the document.body or viewport)
            actions.forEach(({ el, top, left }) => {
              // implement the scroll anyway you want
              el.scrollTop = top - 80;
              el.scrollLeft = left;
            }),
        });

        return;
      }
    }

    const paramUpload: ParamUploadProduct = {
      cat_ids: values.cat_ids || [],
      title: values.title,
      materials: values.materials,
      vertices: values.vertices,
      textures: values.textures,
      geometry: {
        triangles: values.triangles,
        quads: values.quads,
        total_triangles: values.total_triangles,
      },
      image: fileLists?.image ? fileLists?.image[0]?.image : '',
      filename: fileLists?.image ? fileLists?.image[0]?.filename : '',
      filetype: fileLists?.image ? fileLists?.image[0]?.filetype : '',
      description: valueEditor,
      is_animated: values.is_animated,
      is_pbr: values.is_pbr,
      is_rigged: values.is_rigged,
      is_uv: values.is_uv,
      license_id: values.license_id,
      price: values.isFree ? 0 : values.price,
      old_price: values.isFree ? 0 : values.old_price,
      seo_title: values.seo_title,
      seo_description: values.seo_description,
      files: {},
      unit: values.unit,
      brand_id: values.brand_id,
      sell_price: values.sell_price,
      link: values.link,
      item_no: values.item_no,
      file_details: [],
      status: props.isUpdate && productDetail?.status === 1 && !isDraft ? 1 : 5,
      viewer_bg: configs3DViewer?.background,
    };

    if (props.isUpdate) {
      paramUpload.old_image = productDetail?.image || '';
      if (fileLists?.image && fileLists?.image[0]?.isUpdate) {
        paramUpload.image = fileLists?.image ? fileLists?.image[0]?.image : '';
      } else {
        if (!productDetail?.image) {
          delete paramUpload['old_image'];
        }
        paramUpload.image = fileLists?.image ? fileLists?.image[0]?.image : '';
      }
    }

    setLoading(true);
    // Create product
    let isError = false;
    let idProduct = productDetail?.id ? productDetail?.id : '';
    let isFileChange = false;
    let error: any = null;

    let isPublic = true;
    let cateBrandError = {
      cate: [],
      brand: '',
      isError: false,
    };

    // Luồng upfile như Web
    // Tạo hoặc cập nhật trước rồi bắt đầu upfile -> cập nhật
    if (!props.isUpdate) {
      await productServices
        .createProduct(paramUpload)
        .then((resp) => {
          // Check nếu trong quá trình up file mà change status brand, category thì lưu vào biến cateBrandError
          onCheckCateBrandError(resp.data, cateBrandError);
          idProduct = resp.data?.id;
        })
        .catch((err) => {
          isError = true;
          error = err;
          isPublic = false;
        });
    } else {
      await productServices
        .updateProduct(idProduct, paramUpload)
        .then((resp: { error: boolean; data: ProductModel }) => {
          // Check nếu trong quá trình up file mà change status brand, category thì lưu vào biến cateBrandError
          onCheckCateBrandError(resp.data, cateBrandError);
        })
        .catch((err) => {
          error = err;
          isError = true;
          isPublic = false;
        });
    }

    if (!isError) {
      // Check có file thay đổi không dùng cho trường hợp update product
      const listUpload = [];

      if (Object.keys(fileLists).length !== 0) {
        for (const key in fileLists) {
          if (key === 'image') {
            continue;
          }

          // Check update product
          if (props.isUpdate) {
            if (fileLists[key][0]?.image?.startsWith('http')) {
              paramUpload['files'][key] = fileLists[key][0].image || '';
              if (!['DEMO', 'DEMO_USDZ'].includes(key)) {
                paramUpload['file_details'].push(key);
                continue;
              }
              continue;
            }
          }

          isFileChange = true;

          listUpload.push({
            filename: convertFileName(fileLists[key][0].filename ?? ''),
            kind: key === 'DEMO' || key === 'DEMO_USDZ' ? 'public' : 'private',
            fileUpload: fileLists[key][0].fileUpload,
            key,
          });
        }
      }

      if (listUpload.length > 0) {
        await Promise.allSettled(
          listUpload.map(async (list) => {
            // Khi có file cần up thì + status
            setStatusLists((prevState) => ({
              ...prevState,
              total: prevState.total + 1,
              pending: prevState.total + 1,
            }));

            // Khi có file cần up thì lưu thông tin file vào modalLists
            setModalLists((prevState) => {
              return {
                ...prevState,
                isShow: true,
                data: [
                  ...prevState.data,
                  {
                    key: list.key,
                    name: `File ${list.key}: ${fileLists[list.key][0].name || ''} `,
                    loadingUploadPresigned: 0,
                    loadingUploadFile: 0,
                    loadingUploadProduct: 0,
                    size: renderFileSize(fileLists[list.key][0]?.fileUpload?.size) || '',
                    error: { status: 'pending', msg: '' },
                  },
                ],
              };
            });

            await uploadFileServices
              .uploadFilePresigned(
                { filename: list.filename, kind: list.kind },
                {
                  onUploadProgress: (progressEvent: any) =>
                    onConfigAxios(progressEvent, 'loadingUploadPresigned', list.key),
                }
              )
              .then(async (resp) => {
                if (!resp.error) {
                  await axios({
                    method: 'PUT',
                    url: resp.upload,
                    data: list.fileUpload,
                    timeout: 9999 * 999999999,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    transformRequest: (data, headers: any) => {
                      delete headers.common['Authorization'];

                      return data;
                    },
                    onUploadProgress: (progressEvent) =>
                      onConfigAxios(progressEvent, 'loadingUploadFile', list.key),
                  })
                    .then(async () => {
                      if (list.key === 'GLB') {
                        paramUpload['files'][list.key] = resp.download as string;
                        paramUpload['files']['USDZ'] = resp.download_usdz as string;
                      } else if (list.key === 'DEMO') {
                        paramUpload.config_3d_viewer = fileLists.DEMO ? configs3DViewer : {};

                        paramUpload['files'][list.key] = resp.download as string;
                        paramUpload['files']['DEMO_USDZ'] = resp.download_usdz as string;
                      } else {
                        paramUpload['files'][list.key] = resp.download as string;
                      }

                      if (list.key !== 'DEMO') paramUpload['file_details'].push(list.key);
                      if (list.key === 'GLB') paramUpload['file_details'].push('USDZ');

                      await productServices
                        .updateProduct(idProduct, paramUpload, {
                          onUploadProgress: (progressEvent: any) =>
                            onConfigAxios(progressEvent, 'loadingUploadProduct', list.key),
                        })
                        .then((respUpdateProduct: { error: boolean; data: ProductModel }) => {
                          if (!respUpdateProduct.error) {
                            setModalLists((prevState) => ({
                              ...prevState,
                              data: prevState.data.map((item) =>
                                item.key === list.key
                                  ? { ...item, error: { status: 'success', msg: 'Success' } }
                                  : item
                              ),
                              currentFiles: {
                                files: paramUpload.files,
                                file_details: paramUpload.file_details,
                              },
                            }));

                            onCheckCateBrandError(respUpdateProduct.data, cateBrandError);

                            setStatusLists((prevState) => ({
                              ...prevState,
                              pending: prevState.pending - 1,
                              success: prevState.success + 1,
                            }));
                          }
                        })
                        .catch(() => {
                          setModalLists((prevState) => ({
                            ...prevState,
                            data: prevState.data.map((item) =>
                              item.key === list.key
                                ? {
                                    ...item,
                                    error: { status: 'error', msg: 'Error please try again' },
                                  }
                                : item
                            ),
                          }));
                          isPublic = false;
                          setStatusLists((prevState) => ({
                            ...prevState,
                            pending: prevState.pending - 1,
                            error: prevState.error + 1,
                          }));
                        });
                    })
                    .catch(() => {
                      setModalLists((prevState) => ({
                        ...prevState,
                        data: prevState.data.map((item) =>
                          item.key === list.key
                            ? {
                                ...item,
                                error: { status: 'error', msg: 'Error please try again' },
                              }
                            : item
                        ),
                      }));
                      isPublic = false;
                      setStatusLists((prevState) => ({
                        ...prevState,
                        pending: prevState.pending - 1,
                        error: prevState.error + 1,
                      }));
                    });
                }
              })
              .catch((err) => {
                setModalLists((prevState) => ({
                  ...prevState,
                  data: prevState.data.map((item) =>
                    item.key === list.key
                      ? { ...item, error: { status: 'error', msg: 'Error please try again' } }
                      : item
                  ),
                }));
                isPublic = false;
                setStatusLists((prevState) => ({
                  ...prevState,
                  pending: prevState.pending - 1,
                  error: prevState.error + 1,
                }));
                error = err;
              });
          })
        );
      }

      // Kiểm tra lại params status update product
      paramUpload.status = !isPublic || isDraft || cateBrandError.isError ? 5 : 1;

      if (!productId) {
        setProductId(idProduct);
      }
      // Hàm này luôn luôn chạy cuối cùng vì trường hợp up 2 file mà ngang kích thước dẫn đến file sau mang status là 1 chạy xong nhưng có thể hoàn thành trước
      await productServices
        .updateProduct(idProduct, paramUpload)
        .then((resp: { error: boolean; data: ProductModel }) => {
          if (!resp.error) {
            onCheckCateBrandError(resp.data, cateBrandError);
          }
        })
        .catch((err) => (error = err));

      setCateBrandErrorList(cateBrandError);

      if (!isFileChange) {
        let contentMessage = '';
        if (props.isUpdate && !isDraft) {
          contentMessage = 'Update success';
        } else if (isDraft) {
          contentMessage = 'Draft success';
        } else {
          contentMessage = 'Create success';
        }

        if (cateBrandError.isError) {
          setModalLists((prev) => ({ ...prev, isShow: true, data: [] }));
        } else {
          handlerMessage(contentMessage, 'success');
          router.push(urlPage.productNewest);
        }
        return;
      }

      setLoading(false);
    } else {
      onCheckErrorApiMessage(error);
      setLoading(false);
    }
  };

  const onChangeEditor = (value: string) => {
    setValueEditor(value);
  };

  const onSendModelToViewer = (type: 'cancel' | 'model', file?: any) => {
    const iframe = document.querySelector('iframe');
    let postMsg = { type, file };

    iframe?.contentWindow?.postMessage(postMsg, '*');
  };

  const onResetData = () => {
    setFileDetails([]);
    setModalLists({ isShow: false, data: [], currentFiles: {} as currentFile3D });
    setFileLists({});
    onSendModelToViewer('cancel');
    setConfigs3DViewer(undefined);
    setSrcViewer(config.urlModelViewer);
    setProductId('');
    setLoading(false);
    setIsDraft(false);
    form.resetFields();
    setStatusLists({
      total: 0,
      pending: 0,
      success: 0,
      error: 0,
    });
    setCateBrandErrorList(null);
  };

  const onRemoveFile = (e: any, name: string) => {
    e.preventDefault();
    e.stopPropagation();

    setFileLists((prevState) => {
      const copy = { ...prevState };
      if (name === 'GLB') delete copy['USDZ'];
      if (name === 'DEMO') delete copy['DEMO_USDZ'];

      delete copy[name];
      return copy;
    });
    if (name === 'DEMO') {
      onSendModelToViewer('cancel');
      setConfigs3DViewer(undefined);
      setSrcViewer(config.urlModelViewer);
    }
    form.setFieldsValue({ [name]: undefined });
  };

  return (
    <L.Product_wrapper className='position-relative'>
      {(loadingGetDetail || loading) && <Loading fullPage isOpacity />}

      <Form
        form={form}
        onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : null)}
        layout='vertical'
        onFinish={onFinish}
        scrollToFirstError={{
          behavior: (actions) =>
            // list is sorted from innermost (closest parent to your target) to outermost (often the document.body or viewport)
            actions.forEach(({ el, top, left }) => {
              // implement the scroll anyway you want
              el.scrollTop = top - 80;
              el.scrollLeft = left;
            }),
        }}
        className='position-relative'>
        <Row gutter={[0, 20]}>
          <div className='content'>
            <ModelPlay url={srcViewer} />

            <PreviewModelComponent
              fileLists={fileLists}
              form={form}
              onRemoveFile={onRemoveFile}
              setFileLists={setFileLists}
              isDraft={isDraft}
              type={props.type}
              onSendModelToViewer={onSendModelToViewer}
            />
          </div>

          <Includes3DFormatsComponent
            fileLists={fileLists}
            fileDetails={fileDetails}
            setFileLists={setFileLists}
            setFileDetails={setFileDetails}
            form={form}
            onRemoveFile={onRemoveFile}
            isDraft={isDraft}
            type={props.type}
          />

          <MainComponent
            fileLists={fileLists}
            onRemoveFile={onRemoveFile}
            form={form}
            setFileLists={setFileLists}
            isDraft={isDraft}
            type={props.type}
          />

          <BrandsComponent
            form={form}
            type={props.type}
            isDraft={isDraft}
            brandLists={{
              brand_id: props.productDetail?.brand_id || '',
              sell_price: props.productDetail?.sell_price,
              link: props.productDetail?.link || '',
              item_no: props.productDetail?.item_no || '',
            }}
          />

          <DescriptionComponent
            onChangeEditor={onChangeEditor}
            valueEditor={valueEditor}
            type={props.type}
          />

          <Inspect3DModelsComponent type={props.type} />

          <SeoComponent type={props.type} />
          <Col className='group-btn-action-form group-btn-action-form-custom'>
            <hr className='w-100 mt-0' />
            <div>
              <Button danger onClick={() => router.push(`/products/newest`)}>
                Cancel
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {props.type === 'view' ? (
                <Button
                  type='primary'
                  onClick={
                    props.allowAction?.add
                      ? () => router.push(`/products/edit/${productDetail?.id}`)
                      : onToastNoPermission
                  }>
                  Edit
                </Button>
              ) : (
                <>
                  {!props.isUpdate ? (
                    <>
                      <Button type='ghost' htmlType='submit' onClick={() => setIsDraft(true)}>
                        Draft
                      </Button>
                      <Button type='primary' htmlType='submit' onClick={() => setIsDraft(false)}>
                        Publish
                      </Button>
                    </>
                  ) : (
                    ''
                  )}

                  {props.isUpdate &&
                    (props.isUpdate && !isDraft && productDetail?.status === 1 ? (
                      <>
                        <Button type='ghost' htmlType='submit' onClick={() => setIsDraft(true)}>
                          Draft
                        </Button>

                        <Button type='primary' htmlType='submit' onClick={() => setIsDraft(false)}>
                          Update
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type='ghost' htmlType='submit' onClick={() => setIsDraft(true)}>
                          Draft
                        </Button>
                        <Button type='primary' htmlType='submit' onClick={() => setIsDraft(false)}>
                          Publish
                        </Button>
                      </>
                    ))}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Form>

      <ModalLoadComponent
        modalLists={modalLists}
        loading={loading}
        statusLists={statusLists}
        productId={productId}
        form={form}
        isDraft={isDraft}
        onResetData={onResetData}
        productDetail={productDetail}
        isUpdate={props.isUpdate}
        cateBrandErrorList={cateBrandErrorList}
      />
    </L.Product_wrapper>
  );
};

export default ProductAddComponent;
