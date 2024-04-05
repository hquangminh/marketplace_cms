import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';

import couponServices from 'services/coupon-services';

import { CouponType } from 'models/coupon.models';

import withLayout from 'lib/withLayout';
import withAuth from 'lib/withAuth';

import HeaderPageFragment from 'components/fragments/HeaderPage';
import ListCoupons from 'components/pages/Coupons/List';
import { PropsPageType } from 'models/common.model';

const Index = (props: PropsPageType) => {
  const permission = props.auth?.user.permis.coupons;

  const [loading, setLoading] = useState<boolean>(true);
  const [coupons, setCoupon] = useState<CouponType[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await couponServices.getCoupons();

        if (!res.error) setCoupon(res.data);

        setLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const updateCouponList = (
    type: 'add' | 'update' | 'delete',
    couponId: string,
    coupon?: CouponType
  ) => {
    let couponList = coupons ? [...coupons] : [];
    // prettier-ignore
    if (type === 'add' && coupon) couponList.unshift(coupon);
    else if (type === 'update' && coupon)
      couponList.splice(couponList.findIndex((i) => i.id === couponId), 1, coupon);
    else if (type === 'delete')
      couponList.splice(couponList.findIndex((i) => i.id === couponId), 1);
    else return
    setCoupon(couponList);
  };

  return (
    <Fragment>
      <Head>
        <title>Market Place Admin - Coupons</title>
      </Head>

      <HeaderPageFragment fullWidth title='Coupons' />
      <ListCoupons
        allowAction={{ read: permission?.read, add: permission?.write, remove: permission?.remove }}
        loading={loading}
        data={coupons}
        updateCouponList={updateCouponList}
      />
    </Fragment>
  );
};

export default withAuth(withLayout(Index, { sidebar: { selectedKey: 'coupons' } }));
