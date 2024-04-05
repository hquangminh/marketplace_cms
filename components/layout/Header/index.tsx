import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';
import { Avatar, Badge, Dropdown } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { useDispatch } from 'react-redux';
import {
  calculatorCount,
  initialNotifyCount,
  selectNotifyCountState,
} from 'redux/reducers/notification';
import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';
import {
  handlerMessage,
  onCheckErrorApiMessage,
  onToastNoPermission,
  removeCookie,
} from 'common/functions';
import { tokenList, urlPage } from 'common/constant';
import notificationServices from 'services/notification-services';
import authServices from 'services/auth-services';

import { NotificationType, NotifyStatusType } from 'models/dashboard.model';

import * as SC from './style';

const Header = () => {
  const { me }: any = useAppSelector(selectAuthState);

  const { count } = useAppSelector(selectNotifyCountState);
  const permission = me.permis?.notification;

  const dispatch = useDispatch();

  const router = useRouter();

  const [notificationLists, setNotificationLists] = useState<NotificationType>([]);

  useEffect(() => {
    if (permission?.list) {
      (async () => {
        try {
          const resp = await notificationServices.getNotification();

          if (!resp.error) {
            setNotificationLists(resp.data);
          }
        } catch (error) {}
      })();

      (async () => {
        try {
          const resp = await notificationServices.getNotificationCount();

          if (!resp.error) {
            if (resp.data !== count) {
              dispatch(initialNotifyCount(resp.data));
            }
          }
        } catch (error) {}
      })();
    }
  }, [permission]);

  const onLogout = async () => {
    try {
      await authServices.logout();
      removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
      localStorage.removeItem('me');
      axios.defaults.headers.common['Authorization'] = '';
    } catch (error: any) {
      removeCookie([tokenList.TOKEN, tokenList.REFRESH_TOKEN]);
      localStorage.removeItem('me');
      axios.defaults.headers.common['Authorization'] = '';
      onCheckErrorApiMessage(error);
    }
    router.push('/login');
  };

  const onMarkReadNotify = async (type: NotifyStatusType) => {
    try {
      const resp = await notificationServices.markReadNotification({ type });

      if (!resp.error) {
        setNotificationLists(resp.data);
        if (count > 0) {
          const newCount = count - notificationLists.filter((item) => item.type === type)[0].count;
          dispatch(calculatorCount(newCount));
        }

        let urlRedirect = '';

        if (type === NotifyStatusType.NEW_ORDER && router.pathname !== urlPage.orders) {
          urlRedirect = urlPage.orders;
        } else if (
          type === NotifyStatusType.NEW_QUOTE &&
          router.pathname !== urlPage.modelingQuote
        ) {
          urlRedirect = urlPage.modelingQuote;
        } else if (
          type === NotifyStatusType.NEW_PAYMENT &&
          router.pathname !== urlPage.modelingInprogress
        ) {
          urlRedirect = urlPage.modelingInprogress;
        } else if (
          type === NotifyStatusType.NEW_FEEDBACK &&
          router.pathname !== urlPage.modelingFeedback
        ) {
          urlRedirect = urlPage.modelingFeedback;
        } else if (
          type === NotifyStatusType.NEW_FULFILLED &&
          router.pathname !== urlPage.modelingFulfilled
        ) {
          urlRedirect = urlPage.modelingFulfilled;
        }
        if (urlRedirect) {
          router.push(urlRedirect);
        }

        handlerMessage('Mark as read success', 'success');
      }
    } catch (error: any) {
      if (error.status === 401) {
        router.push(`/login?urlBack=${router.asPath}`);
        return;
      }
      handlerMessage(error.data?.message || 'Mark as read error', 'error');
    }
  };

  const countNewOrder = notificationLists[0]?.count || 0;
  const countNewQuote = notificationLists[1]?.count || 0;
  const countNewPayment = notificationLists[2]?.count || 0;
  const countNewFeedback = notificationLists[3]?.count || 0;
  const countFulfilled = notificationLists[4]?.count || 0;

  const menuNotification: ItemType[] = [
    {
      key: 'marketplace',
      type: 'group',
      label: 'Marketplace',
      children: [
        {
          key: 'order',
          onClick: () => onMarkReadNotify(1),
          className: countNewOrder > 0 ? 'show' : '',
          disabled: countNewOrder === 0,
          label: `There are ${countNewOrder} new orders`,
        },
      ],
    },
    {
      key: 'modeling',
      type: 'group',
      label: 'Modeling Service',
      children: [
        {
          key: 'modeling-quote',
          onClick: () => (permission.read ? onMarkReadNotify(2) : onToastNoPermission()),
          className: countNewQuote > 0 ? 'show' : '',
          disabled: countNewQuote === 0,
          label: `There are ${countNewQuote} new quote requests`,
        },
        {
          key: 'modeling-payment',
          onClick: () => (permission.read ? onMarkReadNotify(3) : onToastNoPermission()),
          className: countNewPayment > 0 ? 'show' : '',
          disabled: countNewPayment === 0,
          label: `There are ${countNewPayment} new payments`,
        },
        {
          key: 'modeling-feedback',
          onClick: () => (permission.read ? onMarkReadNotify(4) : onToastNoPermission()),
          className: countNewFeedback > 0 ? 'show' : '',
          disabled: countNewFeedback === 0,
          label: `There are ${countNewFeedback} new feedbacks`,
        },
        {
          key: 'modeling-fulfilled',
          onClick: () => (permission.read ? onMarkReadNotify(5) : onToastNoPermission()),
          className: countFulfilled > 0 ? 'show' : '',
          disabled: countFulfilled === 0,
          label: `There are ${countFulfilled} new fulfilled`,
        },
      ],
    },
  ];

  const menuUser = [
    { key: 'profile', label: <Link href={'/profile'}>Profile</Link> },
    { key: 'divider', type: 'divider' },
    { key: 'logout', label: 'Logout', onClick: onLogout },
  ];

  return (
    <SC.Header_Wrapper id='header'>
      {permission?.list && (
        <Dropdown
          menu={{ items: menuNotification }}
          placement='bottom'
          overlayClassName='notify__wrapper'
          className='notify__dropdown'
          trigger={['click']}
          getPopupContainer={() => document.getElementById('header') || document.body}
          arrow>
          <Badge count={count}>
            <BellOutlined style={{ fontSize: 28 }} />
          </Badge>
        </Dropdown>
      )}
      <Dropdown
        menu={{ items: menuUser }}
        trigger={['click']}
        arrow
        getPopupContainer={() => document.getElementById('header') || document.body}>
        <div className='user-dropdown'>
          <Avatar size={28} src={me?.image || null} icon={<UserOutlined />} />
          {me?.name}
        </div>
      </Dropdown>
    </SC.Header_Wrapper>
  );
};

export default Header;
