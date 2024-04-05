import React, { useState } from 'react';
import Link from 'next/link';

import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';

import { Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import * as AntIcon from '@ant-design/icons';

import { checkIsAdmin } from 'common/functions';

import Icon from 'components/fragments/Icons';

import * as SC from './style';

type PropsType = {
  menuActive: { openKey?: string[]; selectedKey: string };
  menuOpen: boolean;
  onOpenMenu: () => void;
};

const SideBar = (props: PropsType) => {
  const { me }: any = useAppSelector(selectAuthState);

  const [openKeys, setOpenKeys] = useState<string[]>(
    props.menuOpen ? props.menuActive.openKey || [''] : ['']
  );

  return (
    <SC.activeSideBar style={{ width: props.menuOpen ? '249px' : '48px' }}>
      <div className='ant-pro-sider-logo'>
        <Link href='/'>
          <a className='d-flex align-items-center justify-content-center'>
            <svg
              height='24'
              viewBox={`0 0 ${props.menuOpen ? 282 : 58} 50`}
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <g clipPath='url(#a)' fill='#fff'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M85.08 29.12 77.18 8.9h-6.95l12.6 29.54h6.76L102.31 8.9h-6.88l-8.05 20.44h-2.21l-.09-.22ZM106.891 24.18v14.61h6.75V24.23c.03-2.06.73-8.8 8.22-9.43l-.07-6.77c-10.07.62-14.78 8.79-14.9 16.14M267.061 21.09V35.7h6.75V21.14c.03-2.35.72-4.54 1.92-6.15 1.45-1.93 3.55-3.04 6.27-3.28l-.04-6.77c-10.07.62-14.78 8.79-14.89 16.14M144.18 20.86l-4.52-1.08c-1.31-.35-2.31-.73-3.08-1.17-1.21-.69-1.46-1.65-1.46-2.33 0-.68.29-1.73 1.69-2.49 1.97-1.08 4.63-1.05 6.95.07 1.03.49 1.86 1.25 2.48 2.24l5.34-2.17c-.97-1.86-2.32-3.2-4.14-4.11-2.09-1.05-4.5-1.58-7.17-1.58-1.59 0-3.11.2-4.5.6-1.36.39-2.57.96-3.57 1.69-.98.71-1.77 1.58-2.32 2.6-.55.99-.84 2.16-.84 3.46 0 1.15.23 2.15.68 2.99.47.87 1.08 1.62 1.8 2.23.74.63 1.58 1.16 2.49 1.56.92.42 1.83.72 2.7.91l4.15.9c1.85.43 3.14.91 3.95 1.48.91.66 1.4 1.57 1.4 2.63 0 1.06-.56 1.89-1.65 2.56-.97.6-2.27.9-3.86.9-1.59 0-3-.42-4.27-1.24-1.08-.7-1.99-1.72-2.69-3.03l-5.59 2.38c.35.73.79 1.47 1.33 2.19.71.96 1.59 1.81 2.62 2.53 1.03.73 2.27 1.34 3.69 1.79 2.9.93 6.93.91 9.79-.06 1.45-.49 2.7-1.16 3.72-2 1.01-.83 1.8-1.79 2.35-2.85.54-1.05.81-2.16.81-3.3 0-1.97-.65-3.63-1.99-5.08-1.35-1.46-3.47-2.54-6.31-3.22M193.45 26.63 186 8.8h-7.18l12.06 27.27-.02.05-6.18 13.59h6.69L209.16 8.8h-7l-7.17 17.9h-1.51l-.03-.07Z'
                />
                <path d='M222.401 0h-6.62v36.7h6.62V0Z' />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M167.36 0h-6.26v8.8h-5.18v5.12h5.18v14.04c0 3.16.87 5.61 2.59 7.29.73.74 1.64 1.34 2.71 1.76 2.21.88 5.18.73 7.07.34.24-.05.49-.11.77-.19v-5.77l-.19.04c-.23.05-.43.09-.53.13-.49.17-1.11.25-1.9.25-1.29 0-2.31-.43-3.03-1.28-.47-.49-.81-1.13-.98-1.86-.15-.65-.23-1.37-.23-2.14V13.92h7.23V8.8h-7.23V0h-.02ZM260.011 23.38c.8-8.86-6.14-16.33-14.81-16.41-8.11-.08-15.04 6.69-15.16 14.79-.12 8.38 6.66 15.24 15.02 15.24 5.51 0 10.33-2.98 12.94-7.42.16-.27-.05-.62-.37-.62h-5.57a9.86 9.86 0 0 1-7.01 2.92c-4.99 0-9.08-3.72-9.76-8.52h19.52v.02h5.2Zm-24.1-5.14c1.48-3.6 5.02-6.15 9.15-6.15 4.13 0 7.67 2.55 9.15 6.15h-18.3ZM40.63 40.98h-6.24a2.68 2.68 0 0 1 0-5.36h6.24c5.93 0 10.76-4.83 10.76-10.76S46.56 14.1 40.63 14.1H16.12c-5.93 0-10.76 4.83-10.76 10.76s4.83 10.76 10.76 10.76h6.05a2.68 2.68 0 0 1 0 5.36h-6.05C7.23 40.98 0 33.74 0 24.85 0 15.96 7.23 8.73 16.12 8.73h24.51c8.89 0 16.12 7.23 16.12 16.12s-7.23 16.12-16.12 16.12'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M36.6 27.58c0 1.96-1.59 3.56-3.56 3.56s-3.56-1.59-3.56-3.56 1.59-3.56 3.56-3.56 3.56 1.59 3.56 3.56Z'
                />
              </g>
              <defs>
                <clipPath id='a'>
                  <path fill='#fff' d='M0 0h282v49.71H0z' />
                </clipPath>
              </defs>
            </svg>
          </a>
        </Link>
      </div>

      <Menu
        theme='dark'
        mode='inline'
        openKeys={openKeys}
        onOpenChange={(openKeys: string[]) => setOpenKeys(openKeys)}
        selectedKeys={[props.menuActive?.selectedKey]}
        inlineCollapsed={!props.menuOpen}
        items={me.permis ? menuItems(me.permis) : []}
      />

      <div
        className='nav__btn'
        onClick={() => {
          sessionStorage.setItem('menuCollapsed', props.menuOpen ? '0' : '1');
          props.menuOpen
            ? setOpenKeys([''])
            : setTimeout(() => setOpenKeys(props.menuActive?.openKey || ['']), 100);
          props.onOpenMenu();
        }}>
        {!props.menuOpen ? <AntIcon.MenuUnfoldOutlined /> : <AntIcon.MenuFoldOutlined />}
      </div>
    </SC.activeSideBar>
  );
};

export default SideBar;

const menuItems = (permis: any): ItemType[] => {
  let isAdmin = checkIsAdmin(permis);

  return [
    {
      label: <Link href={'/'}>Dashboard</Link>,
      key: 'dashboard',
      icon: <AntIcon.DashboardOutlined />,
    },
    isAdmin && {
      label: 'Homepage',
      key: 'homepage',
      icon: <AntIcon.HomeOutlined />,
      children: [
        {
          label: <Link href={'/homepage'}>General</Link>,
          key: 'homepage-general',
        },
        {
          label: <Link href={'/homepage/featured-products'}>Featured Products</Link>,
          key: 'homepage-featured-products',
        },
      ],
    },
    {
      label: 'Modeling Service',
      key: 'modeling-service',
      icon: <AntIcon.PicLeftOutlined />,
      children: [
        {
          label: 'Landing Page',
          key: 'modeling-service-landing-page',
          children: [
            {
              label: 'Banner',
              key: 'modeling-service-landing-page-banner',
              children: [
                {
                  label: <Link href={'/modeling-service/landing-page/banner'}>List</Link>,
                  key: 'modeling-service-landing-page-banner-list',
                },
                {
                  label: <Link href={'/modeling-service/landing-page/banner/create'}>Create</Link>,
                  key: 'modeling-service-landing-page-banner-create',
                },
              ],
            },
            {
              label: <Link href={'/modeling-service/landing-page/customer'}>Customer</Link>,
              key: 'modeling-service-landing-page-customer',
            },
            {
              label: <Link href={'/modeling-service/landing-page/step'}>Step</Link>,
              key: 'modeling-service-landing-page-step',
            },
            {
              label: 'Product',
              key: 'modeling-service-landing-page-product',
              children: [
                {
                  label: <Link href={'/modeling-service/landing-page/product'}>List</Link>,
                  key: 'modeling-service-landing-page-product-list',
                },
                {
                  label: <Link href={'/modeling-service/landing-page/product/create'}>Create</Link>,
                  key: 'modeling-service-landing-page-product-create',
                },
              ],
            },
            {
              label: 'Pricing',
              key: 'modeling-service-landing-page-pricing',
              children: [
                {
                  label: <Link href={'/modeling-service/landing-page/pricing'}>List</Link>,
                  key: 'modeling-service-landing-page-pricing-list',
                },
                {
                  label: <Link href={'/modeling-service/landing-page/pricing/create'}>Create</Link>,
                  key: 'modeling-service-landing-page-pricing-create',
                },
              ],
            },
            {
              label: <Link href={'/modeling-service/landing-page/FAQs'}>FAQs</Link>,
              key: 'modeling-service-landing-page-FAQs',
            },
          ],
        },
        {
          label: 'Orders',
          key: 'modeling-service-order',
          children: [
            {
              label: <Link href='/modeling-service/orders/all'>All</Link>,
              key: 'modeling-service-order-all',
            },
            {
              label: <Link href='/modeling-service/orders/pending-quote'>Pending quote</Link>,
              key: 'modeling-service-order-pending-quote',
            },
            {
              label: <Link href='/modeling-service/orders/pending-payment'>Pending payment</Link>,
              key: 'modeling-service-order-pending-payment',
            },
            {
              label: <Link href='/modeling-service/orders/in-progress'>In progress</Link>,
              key: 'modeling-service-order-in-progress',
            },
            {
              label: <Link href='/modeling-service/orders/in-repair'>In repair</Link>,
              key: 'modeling-service-order-in-repair',
            },
            {
              label: (
                <Link href='/modeling-service/orders/pending-my-review'>Pending my review</Link>
              ),
              key: 'modeling-service-order-pending-my-review',
            },
            {
              label: <Link href='/modeling-service/orders/fulfilled'>Fulfilled</Link>,
              key: 'modeling-service-order-fulfilled',
            },
            {
              label: <Link href='/modeling-service/orders/canceled'>Canceled</Link>,
              key: 'modeling-service-order-canceled',
            },
            {
              label: <Link href='/modeling-service/orders/search'>Search</Link>,
              key: 'modeling-service-order-search',
              icon: <AntIcon.SearchOutlined />,
            },
            {
              label: <Link href='/modeling-service/orders/search-product'>Search Product</Link>,
              key: 'modeling-service-order-search-product',
              icon: <AntIcon.SearchOutlined />,
            },
            {
              label: <Link href='/modeling-service/orders/feedback'>Feedback</Link>,
              key: 'modeling-service-order-feedback',
              icon: <AntIcon.CommentOutlined />,
            },
          ],
        },
      ],
    },
    permis.license?.list && {
      label: <Link href={'/license'}>License</Link>,
      key: 'license',
      icon: <AntIcon.FileDoneOutlined />,
    },
    permis.help?.list && {
      label: 'Help',
      key: 'help',
      icon: <Icon iconName='sidebar-help' />,
      children: [
        {
          label: <Link href={'/help/category'}>Category</Link>,
          key: 'help-category',
          icon: <AntIcon.BarsOutlined />,
        },
        { label: <Link href={'/help'}>List</Link>, key: 'help-list' },
        permis.help?.write && {
          label: <Link href={'/help/create'}>Create</Link>,
          key: 'help-create',
        },
      ],
    },
    permis.blog?.list && {
      label: 'Blog',
      key: 'blog',
      icon: <Icon iconName='sidebar-blog' />,
      children: [
        {
          label: <Link href={'/blog/category'}>Category</Link>,
          key: 'category-blog',
          icon: <AntIcon.BarsOutlined />,
        },
        permis.blog?.list && { label: <Link href={'/blog'}>List</Link>, key: 'blog-list' },
        permis.blog?.write && {
          label: <Link href={'/blog/create'}>Create</Link>,
          key: 'blog-create',
        },
      ],
    },
    permis.seo?.list && {
      label: 'Seo',
      key: 'seo',
      icon: <Icon iconName='seo' />,
      children: [
        { label: <Link href={'/seo'}>List</Link>, key: 'seo-list' },
        permis.seo?.write && {
          label: <Link href={'/seo/create'}>Create</Link>,
          key: 'seo-add',
          icon: <AntIcon.PlusSquareOutlined />,
        },
      ],
    },
    permis.category?.list && {
      label: <Link href={'/category'}>Category</Link>,
      key: 'category',
      icon: <AntIcon.BarsOutlined />,
    },
    {
      label: 'Brands',
      key: 'brands',
      icon: <AntIcon.CrownOutlined />,
      children: [
        { label: <Link href={'/brands'}>List</Link>, key: 'brands-list' },
        {
          label: <Link href={'/brands/create'}>Create</Link>,
          key: 'brands-create',
          icon: <AntIcon.PlusSquareOutlined />,
        },
      ],
    },
    permis.products?.list && {
      label: 'Product',
      key: 'products',
      icon: <AntIcon.SketchOutlined />,
      children: [
        {
          label: <Link href={'/products/popular'}>Most Popular</Link>,
          key: 'products-popular',
        },
        {
          label: <Link href={'/products/hotest'}>Most Hotest</Link>,
          key: 'products-hotest',
        },
        {
          label: <Link href={'/products/newest'}>Newest</Link>,
          key: 'products-newest',
        },
        {
          label: <Link href={'/products/comments'}>Comments</Link>,
          key: 'products-comments',
          icon: <AntIcon.CommentOutlined />,
        },
        {
          label: <Link href={'/products/reviews'}>Reviews</Link>,
          key: 'products-reviews',
          icon: <AntIcon.StarOutlined />,
        },
        {
          label: <Link href={'/products/temporary'}>Temporary</Link>,
          key: 'products-temporary',
          icon: <AntIcon.DeleteOutlined />,
        },
        {
          label: <Link href={'/products/search'}>Search</Link>,
          key: 'products-search',
          icon: <AntIcon.SearchOutlined />,
        },
        permis.products?.write && {
          label: <Link href='/products/create'>Create</Link>,
          key: 'products-create',
          icon: <AntIcon.PlusSquareOutlined />,
        },
      ],
    },
    permis.coupons?.list && {
      label: <Link href={'/coupons'}>Coupons</Link>,
      key: 'coupons',
      icon: <Icon iconName='coupon-outline' />,
    },
    permis.orders?.list && {
      label: 'Orders',
      key: 'order',
      icon: <Icon iconName='list-outline' />,
      children: [
        { label: <Link href={'/orders'}>Newest</Link>, key: 'orders-newest' },
        { label: <Link href={'/orders/search'}>Search</Link>, key: 'orders-search' },
      ],
    },
    permis.users?.list && {
      label: 'Account',
      key: 'users',
      icon: <AntIcon.UserOutlined />,
      children: [
        { label: <Link href={'/users'}>List</Link>, key: 'users-list' },
        { label: <Link href={'/users/search'}>Search</Link>, key: 'users-search' },
        permis.showroom?.write && {
          label: <Link href={'/showroom/create'}>Create Showroom</Link>,
          key: 'showroom-create',
          icon: <AntIcon.PlusSquareOutlined />,
        },
      ],
    },
    isAdmin && {
      label: 'Administrators',
      key: 'accounts',
      icon: <Icon iconName='administrator-outline' />,
      children: [
        { label: <Link href={'/accounts'}>List</Link>, key: 'accounts-list' },
        {
          label: <Link href={'/accounts/create'}>Create</Link>,
          key: 'accounts-add',
          icon: <AntIcon.PlusSquareOutlined />,
        },
      ],
    },
    isAdmin && {
      key: 'vrstyler_accounts',
      label: <Link href={'/accounts/vrstyler'}>VRStyler Accounts</Link>,
      icon: <AntIcon.TeamOutlined />,
    },
    permis.media?.list && {
      label: <Link href={'/media'}>Media</Link>,
      key: 'media',
      icon: <AntIcon.FileImageOutlined />,
    },
    permis.banner?.list && {
      label: <Link href={'/banner'}>Banner</Link>,
      key: 'banner',
      icon: <AntIcon.BorderOutlined />,
    },
    permis.withdraw?.list && {
      label: <Link href={'/withdraw'}>Withdraw</Link>,
      key: 'withdraw',
      icon: <AntIcon.DollarCircleOutlined />,
    },
    isAdmin && {
      label: 'Settings',
      key: 'settings',
      icon: <AntIcon.SettingOutlined />,
      children: [
        { label: <Link href={'/settings/general'}>Website</Link>, key: 'settings-general' },
        { label: <Link href={'/settings/language'}>Language</Link>, key: 'settings-language' },
      ],
    },
  ];
};
