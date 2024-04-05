import { ReactSVG } from 'react-svg';
import styled from 'styled-components';

type Props = {
  iconName:
    | 'list-outline'
    | 'minus-line'
    | 'order-no'
    | 'card-credit'
    | 'receipt-outline'
    | 'coins-outline'
    | 'info-circle-outline'
    | 'coupon-outline'
    | 'administrator-outline'
    | 'seo'
    | 'sidebar-help'
    | 'sidebar-blog'
    | 'paypal'
    | 'stripe'
    | 'reset-temporary'
    | 'visa';
  className?: string;
  color?: string;
};

const Icon = (props: Props) => {
  const renderFileSVG = () => {
    switch (props.iconName) {
      case 'list-outline':
        return '/static/icons/list-outline.svg';
      case 'minus-line':
        return '/static/icons/minus-line.svg';
      case 'order-no':
        return '/static/icons/order-no.svg';
      case 'card-credit':
        return '/static/icons/card-credit.svg';
      case 'receipt-outline':
        return '/static/icons/receipt-outline.svg';
      case 'coins-outline':
        return '/static/icons/coins-outline.svg';
      case 'info-circle-outline':
        return '/static/icons/info-circle-outline.svg';
      case 'coupon-outline':
        return '/static/icons/coupon-outline.svg';
      case 'administrator-outline':
        return '/static/icons/administrator-outline.svg';
      case 'seo':
        return '/static/icons/seo.svg';
      case 'sidebar-help':
        return '/static/icons/sidebar-help.svg';
      case 'sidebar-blog':
        return '/static/icons/sidebar-blog.svg';
      case 'reset-temporary':
        return '/static/icons/reset-temporary.svg';
      case 'paypal':
        return '/static/icons/paypal.svg';
      case 'stripe':
        return '/static/icons/stripe.svg';
      case 'visa':
        return '/static/icons/visa.svg';
      default:
        return '';
    }
  };

  return (
    <IconWrapper
      className={`anticon my-icon ${props.className}`}
      color={props.color}
      wrapper='span'
      src={renderFileSVG()}
    />
  );
};

export default Icon;

const IconWrapper = styled(ReactSVG)<{ color: string }>`
  span {
    width: 1em;
    height: 1em;
    color: ${(props) => props.color || 'inherit'};
  }

  svg {
    width: inherit;
    height: inherit;

    fill: currentColor;
  }
`;
