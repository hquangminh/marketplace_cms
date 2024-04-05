import { useState } from 'react';

import { arrayMove, List } from 'react-movable';
import { Button, Col, Empty, Input, Row, Spin, Tooltip } from 'antd';
import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';

import productServices from 'services/product-services';
import { handlerMessage, onCheckErrorApiMessage, searchDebounce } from 'common/functions';

import HeaderPageFragment from 'components/fragments/HeaderPage';

import { ProductFeaturedModel } from 'models/homepage.model';
import { ProductModel, StatusProduct } from 'models/product.model';

import { PageContent } from 'styles/__styles';
import styled from 'styled-components';

const Wrapper = styled.div`
  .ant-spin-spinning:not(.ant-spin-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
  }
  .list-product-search .ant-spin-container {
    margin-top: 15px;
    padding-right: 5px;
    height: 500px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: #ddd;
    }
  }
`;
const HeaderSection = styled.div`
  margin-bottom: 15px;
  font-size: 15px;
  font-weight: 500;
`;
const ListProduct = styled(PageContent)``;
interface ProductItemProps {
  isDragged?: boolean;
  isSelected?: boolean;
  isActive?: boolean;
}
const ProductItem = styled.div<ProductItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  opacity: ${(props) => (props.isActive ? 1 : 0.5)};

  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  background-color: ${({ isDragged, isSelected }) =>
    isDragged || isSelected ? '#f6f6f6' : '#fff'};
  cursor: ${({ isDragged }) => (isDragged ? 'grabbing' : 'grab')};

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
  p {
    font-size: 15px;
  }
  .btn-remove,
  .btn-add {
    position: absolute;
    top: 50%;
    right: 10px;
    z-index: 2;
    transform: translateY(-50%);
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      filter: grayscale(1);
    }
  }

  .text-truncate {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 35px;
  }
`;

interface Props {
  featuredProducts?: ProductFeaturedModel[];
}

const HomepageFeaturedProduct = ({ featuredProducts }: Props) => {
  const [products, setProducts] = useState<ProductFeaturedModel[]>(featuredProducts ?? []);
  const [productSearch, setProductSearch] = useState<ProductModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDefaultValue, setIsDefaultValue] = useState<boolean>(Boolean(featuredProducts?.length));

  const onCheckProductAvailable = (data: ProductFeaturedModel) => {
    return (
      (!data.market_item.status || data.market_item.status === StatusProduct.PUBLISH) &&
      !data.market_item?.is_temporary &&
      !data.market_item?.market_item_categories?.every((e) => e.market_category.status === false)
    );
  };

  const handelSearchProduct = async (value: string) => {
    if (productSearch?.length === 0) {
      return;
    }
    setLoading(true);
    // prettier-ignore
    const keyword = value.trim();
    if (keyword)
      await productServices.searchProduct(keyword).then((res) => setProductSearch(res.data));
    else setProductSearch(undefined);
    setLoading(false);
  };

  const onSubmit = async () => {
    try {
      if (products.length < 6) {
        handlerMessage('Please add 6 products', 'error');
        return;
      } else if (products.some((product) => !onCheckProductAvailable(product))) {
        handlerMessage('Please remove invalid products', 'error');
        return;
      } else if (products.length !== 0) {
        setSubmitting(true);
        await productServices
          .createProductFeatured(
            products.map((prod, index) => ({ item_id: prod.item_id, sort_id: index + 1 }))
          )
          .then(() => {
            if (!isDefaultValue) setIsDefaultValue(true);
            handlerMessage('Update successful', 'success');
          })
          .catch((error: any) => {
            onCheckErrorApiMessage(error);
            if (error.data?.error_code === 'LIST_ITEM_INVALID') {
              const newData = error.data?.result;

              setProducts((prevProducts) => {
                const updatedProducts = prevProducts.map((product) => {
                  const index = newData.findIndex((s: any) => s.id === product.id);

                  if (index !== -1) {
                    const updatedProduct = { ...product };
                    updatedProduct.market_item = newData[index];
                    return updatedProduct;
                  } else {
                    return { ...product };
                  }
                });

                return updatedProducts;
              });
            }
          });
        setSubmitting(false);
      } else {
        setSubmitting(false);
        if (isDefaultValue) {
          setIsDefaultValue(false);
        }
        handlerMessage('Update successful', 'success');
      }
    } catch (error: any) {
      setSubmitting(false);
      onCheckErrorApiMessage(error);
    }
  };

  return (
    <Wrapper>
      <HeaderPageFragment title='Featured Products' />

      <ListProduct>
        <Row gutter={[20, 20]}>
          <Col span={24} xl={12}>
            <HeaderSection>Drag to sort</HeaderSection>
            <List
              values={products}
              onChange={({ oldIndex, newIndex }) =>
                setProducts(arrayMove(products, oldIndex, newIndex))
              }
              renderList={({ children, props }) => <div {...props}>{children}</div>}
              renderItem={({ value, props, isDragged, isSelected }) => {
                const isActive = onCheckProductAvailable(value);
                return (
                  <ProductItem
                    {...props}
                    isDragged={isDragged}
                    isSelected={isSelected}
                    isActive={isActive}>
                    <img src={value.image} alt='' />
                    <Tooltip title={value.title}>
                      <p className='text-truncate'>{value.title}</p>
                    </Tooltip>
                    <DeleteTwoTone
                      twoToneColor='#ff4d4f'
                      className='btn-remove'
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setProducts((current) => current.filter((i) => i.id !== value.id));
                      }}
                    />
                  </ProductItem>
                );
              }}
            />
          </Col>

          <Col span={24} xl={12}>
            <HeaderSection>All products</HeaderSection>

            <Input
              placeholder='Search product'
              onChange={searchDebounce((e) => handelSearchProduct(e.target.value))}
            />
            <Spin spinning={loading} wrapperClassName='list-product-search'>
              {productSearch && productSearch.length > 0 && !loading ? (
                productSearch
                  .filter((i) => !products.some((p) => p.item_id === i.id))
                  .map((item) => (
                    <ProductItem key={item.id} isActive>
                      <img src={item.image} alt='' />
                      <p className='text-truncate'>{item.title}</p>
                      <PlusCircleTwoTone
                        twoToneColor='#52c41a'
                        className={'btn-add' + (products.length === 6 ? ' disabled' : '')}
                        onClick={() =>
                          products.length < 6 &&
                          setProducts((current) =>
                            current.concat([
                              {
                                ...item,
                                id: item.id,
                                item_id: item.id,
                                sort_id: current.length + 1,
                                market_item: {
                                  id: item.id,
                                  title: item.title,
                                  image: item.image,
                                  status: item.status,
                                  market_item_categories: item.market_item_categories,
                                },
                              },
                            ])
                          )
                        }
                      />
                    </ProductItem>
                  ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Spin>
          </Col>
          <Col sm={24} className='text-right'>
            <hr className='mt-0' />
            <Button
              type='primary'
              disabled={products.length === 0 && !isDefaultValue}
              loading={submitting}
              onClick={onSubmit}>
              Save
            </Button>
          </Col>
        </Row>
      </ListProduct>
    </Wrapper>
  );
};

export default HomepageFeaturedProduct;
