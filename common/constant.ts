import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';
import { LiteralUnion } from 'antd/es/_util/type';
import { optionsType } from 'models/common.model';
import { colorPermisType } from 'models/constant.model';
import { OrderStatusType } from 'models/order.model';
import { UserType } from 'models/user.model';

export const theme = {
  primary_color: '#6DB2C5',
  error_color: '#FF4D4F',
  error_color_deprecated_bg: '#FFF2F0',
  error_color_deprecated_border: '#FFCCC7',
};

export const ProductFileFormat = [
  { title: 'FBX(Autodesk FBX)', label: 'FBX(Autodesk FBX)', value: 'FBX' },
  { title: 'BLEND', label: 'BLEND', value: 'BLEND' },
  { title: 'GLB(STK Globe File)', label: 'GLB(STK Globe File)', value: 'GLB' },
  { title: 'GLTF', label: 'GLTF', value: 'GLTF' },
  { title: '3DS (3DS Max)', label: '3DS (3DS Max)', value: '3DS' },
  { title: 'MAX (3DS Max)', label: 'MAX (3DS Max)', value: 'MAX' },
  { title: 'OBJ', label: 'OBJ', value: 'OBJ' },
  { title: 'C4D', label: 'C4D', value: 'C4D' },
  { title: 'MB', label: 'MB', value: 'MB' },
  { title: 'MA', label: 'MA', value: 'MA' },
  { title: 'LWO', label: 'LWO', value: 'LWO' },
  { title: 'LXO', label: 'LXO', value: 'LXO' },
  { title: 'SKP', label: 'SKP', value: 'SKP' },
  { title: 'STL', label: 'STL', value: 'STL' },
  { title: 'UNITY', label: 'UNITY', value: 'UNITY' },
  { title: 'UASSET', label: 'UASSET', value: 'UASSET' },
  { title: 'DAE', label: 'DAE', value: 'DAE' },
  { title: 'PLY', label: 'PLY', value: 'PLY' },
  { title: 'GOZ', label: 'GOZ', value: 'GOZ' },
  { title: 'SPP', label: 'SPP', value: 'SPP' },
];

export const tokenList = {
  TOKEN: 'VRSTYLER_ADMIN_TOKEN',
  REFRESH_TOKEN: 'VRSTYLER_ADMIN_REFRESH_TOKEN',
};

export const colorPermis: colorPermisType[] = [
  { key: 'admin', value: 'magenta' },
  { key: 'category', value: 'volcano' },
  { key: 'users', value: 'orange' },
  { key: 'items', value: 'lime' },
  { key: 'orders', value: 'blue' },
];

export const permissOptions: optionsType[] | any = [
  { label: 'Admin', value: 'admin', key: 'admin' },
  { label: 'Product', value: 'items', key: 'item' },
  { label: 'Category', value: 'category', key: 'category' },
  { label: 'User', value: 'users', key: 'users' },
  { label: 'Order', value: 'orders', key: 'orders' },
  { label: 'Coupon', value: 'coupons', key: 'coupons' },
  { label: 'Seo', value: 'seo', key: 'seo' },
];

export const messageValidatePW =
  'Password consists of 6 to 16 characters, including 1 uppercase letter, 1 special character, and one number';

export const roleConstant = {
  admin: 'admin',
  category: 'category',
  product: 'items',
  user: 'users',
  order: 'orders',
  coupon: 'coupons',
};

export const groupRoleConstant = {
  admin: 'admin',
  product: 'product',
  user: 'user',
  order: 'order',
  custom: 'custom',
};

export const optionsPermission = [
  { label: 'List', value: 'list' },
  { label: 'View', value: 'read' },
  { label: 'Add / Update', value: 'write' },
  { label: 'Remove', value: 'remove' },
];

export const listPermission = [
  'Category',
  'Products',
  'Users',
  'Orders',
  'Coupons',
  'Reports',
  'Media',
  'Seo',
  'Help',
  'Blog',
  'Banner',
  'License',
  'Withdraw',
  'Notification',
  'Showroom',
];

export const OrderStatus: OrderStatusType = {
  1: 'Succeed',
  2: 'Processing',
  3: 'Refunded',
  4: 'New',
  5: 'Failed',
  6: 'Cancelled',
};

export const validationUploadFile = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  allImage: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  allImageAndVideo: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'video/*'],
  models: ['.fbx, .mb, .max, .blend, .stl, .goz, .spp, .glb, .usdz, .obj, .gltf'],
};

export const urlPage = {
  explore: '/explore/{category}',
  saleOff: '/sale-off/{category}',
  freeModels: '/free-models/{category}',
  license: '/license/{slug}',
  profile: '/{nickname}',
  orders: '/orders',
  modelingQuote: '/modeling-service/orders/pending-quote',
  modelingPayment: '/modeling-service/orders/pending-payment',
  modelingInprogress: '/modeling-service/orders/in-progress',
  modelingFeedback: '/modeling-service/orders/feedback',
  modelingFulfilled: '/modeling-service/orders/fulfilled',

  // Product
  productDetail: '/product/{slug}',
  productNewest: '/products/newest',

  // User
  userDetail: '/users/{id}',
};

export const imageSupported = ['png', 'jpg', 'jpeg', 'webp'];

export const regex = {
  emoji:
    /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/,
  url: /^(ftp|http|https):\/\/[^ "]+$/i,
  isInteger: /^([-]?[1-9][0-9]*|0)$/,
};

export const userType: {
  key: UserType;
  title: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
}[] = [
  { key: UserType.CUSTOMER, title: 'Customer', color: 'blue' },
  { key: UserType.SELLER, title: 'Seller', color: 'cyan' },
  { key: UserType.SHOWROOM, title: 'Showroom', color: 'gold' },
];
