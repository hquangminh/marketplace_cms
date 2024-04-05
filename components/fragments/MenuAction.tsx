import { ReactNode } from 'react';
import { Dropdown } from 'antd';
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  CopyFilled,
  CheckOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

import Icon from './Icons';

import { showConfirmDelete } from './ModalConfirm';

import { ProductModel } from 'models/product.model';
import { CouponType } from 'models/coupon.models';
import { AdministratorType } from 'models/administrator.model';

import { mediaType } from 'models/media.models';
import { SeoModel } from 'models/seo.models';
import { BannerModel } from 'models/banner.model';
import { DataHelpType } from 'models/help-model';
import { LicenseModel } from 'models/license.models';
import { BannerDetailType } from 'models/modeling-landing-page-banner';
import { ModelingOrderModel } from 'models/modeling-landing-page-orders';
import { ProductModel as ProductModelOrder } from 'models/modeling-landing-page-orders';
import { UserModel } from 'models/user.model';

import styled from 'styled-components';

type Disabled = 'view' | 'edit' | 'delete' | 'copy' | 'active' | 'restore' | 'cancel' | '';

type Props = {
  data:
    | ProductModel
    | CouponType
    | AdministratorType
    | mediaType
    | SeoModel
    | BannerModel
    | DataHelpType
    | LicenseModel
    | BannerDetailType
    | ModelingOrderModel
    | ProductModelOrder
    | UserModel;
  disabled?: Disabled[];
  contentDelete?: { title?: string; content?: string };
  contentRestore?: { title?: string; content?: string };
  label?: { edit: ReactNode };
  handleView?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handelCopy?: () => void;
  handleActive?: () => void;
  handleRestore?: () => void;
  handleCancel?: () => void;
};

const MenuAction = (props: Props) => {
  const actionMenu = (data: any) => {
    let menuItems = [];

    if (props.handleActive)
      menuItems.push({
        key: 'active',
        label: data?.status ? 'In-Active' : 'Active',
        icon: <CheckOutlined />,
        disabled: props.disabled?.includes('active'),
        onClick: props.handleActive,
      });

    if (props.handleRestore) {
      menuItems.push({
        key: 'restore',
        label: 'Restore',
        icon: (
          <div className='d-flex align-items-center'>
            <Icon iconName='reset-temporary' />
          </div>
        ),
        disabled: props.disabled?.includes('restore'),
        onClick: () =>
          props.handleRestore &&
          showConfirmDelete(
            data.id,
            props.handleRestore,
            props.contentRestore?.title,
            props.contentRestore?.content
          ),
      });
    }

    if (props.handelCopy)
      menuItems.push({
        key: 'copy',
        label: 'Copy',
        icon: <CopyFilled />,
        disabled: props.disabled?.includes('copy'),
        onClick: props.handelCopy,
      });

    if (props.handleView)
      menuItems.push({
        key: 'view',
        label: 'View',
        icon: <EyeFilled />,
        disabled: props.disabled?.includes('view'),
        onClick: props.handleView,
      });

    if (props.handleEdit)
      menuItems.push({
        key: 'edit',
        label: props.label?.edit || 'Edit',
        icon: <EditFilled />,
        disabled: props.disabled?.includes('edit'),
        onClick: props.handleEdit,
      });

    if (props.handleDelete)
      menuItems.push({
        key: 'delete',
        label: 'Delete',
        icon: <DeleteFilled />,
        disabled: props.disabled?.includes('delete'),
        onClick: () =>
          props.handleDelete &&
          showConfirmDelete(
            data.id,
            props.handleDelete,
            props.contentDelete?.title,
            props.contentDelete?.content
          ),
      });

    if (props.handleCancel)
      menuItems.push({
        key: 'cancel',
        label: 'Cancel',
        icon: <MinusCircleOutlined />,
        disabled: props.disabled?.includes('cancel'),
        onClick: props.handleCancel,
      });

    return menuItems;
  };

  return (
    <MenuAction_Wrap>
      <DropdownWrapper
        menu={{ items: actionMenu(props.data) }}
        trigger={['click']}
        arrow
        placement='bottom'
        overlayClassName='menu-action'>
        <MoreOutlined />
      </DropdownWrapper>
    </MenuAction_Wrap>
  );
};

export default MenuAction;

const MenuAction_Wrap = styled.div`
  .ant-dropdown-menu-title-content a {
    transition: none;
  }
`;

export const DropdownWrapper = styled(Dropdown)``;
