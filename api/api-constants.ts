import config from 'config';

const API_SERVER = config.apiServer;

const apiConstant = Object.freeze({
  // Auth
  auth: `${API_SERVER}/cmsAuth/login`,
  logout: `${API_SERVER}/cmsAuth/logout`,
  validateToken: `${API_SERVER}/cmsAuth/validateToken`,
  refreshToken: `${API_SERVER}/cmsAuth/refreshToken`,

  // Profile
  profile: `${API_SERVER}/administrators`,

  // Category
  category: `${API_SERVER}/category`,

  //Product
  productPopular: `${API_SERVER}/items/cms/most-popular/{limit}/{offset}`,
  productHotest: `${API_SERVER}/items/cms/most-hotest/{limit}/{offset}`,
  productNewest: `${API_SERVER}/items/cms/newest/{limit}/{offset}`,
  productFilter: `${API_SERVER}/items/cms/filter`,
  products: `${API_SERVER}/items`,
  productSearch: `${API_SERVER}/items/featured/filter`,

  //Brands
  brands: `${API_SERVER}/brands`,

  //User
  userList: `${API_SERVER}/users/cms/{type}/{limit}/{offset}`,
  userSearch: `${API_SERVER}/users/cms/search`,
  userDetail: `${API_SERVER}/users/cms/{userId}`,
  users: `${API_SERVER}/users/cms`,

  //Showroom
  showroom: `${API_SERVER}/showroom/cms`,

  //Order
  orderNewest: `${API_SERVER}/orders/newest/{end_date}`,
  orderSearch: `${API_SERVER}/orders/search`,
  orderDetail: `${API_SERVER}/orders/{order_id}`,

  //Coupon
  coupon: `${API_SERVER}/coupons`,
  couponDetail: `${API_SERVER}/coupons/{couponId}`,

  //Administrator
  administrator: `${API_SERVER}/administrators`,

  // Media
  media: `${API_SERVER}/media`,

  // Seo
  seo: `${API_SERVER}/seo`,

  // Settings
  settings: `${API_SERVER}/settings`,

  // Language
  language: `${API_SERVER}/language`,
  languageList: `${API_SERVER}/language/list`,

  // Homepage
  homepage: `${API_SERVER}/homepage`,

  // Help
  help: `${API_SERVER}/help`,
  helpCategory: `${API_SERVER}/category-help`,

  // Blog
  blog: `${API_SERVER}/blog`,
  categoryBlog: `${API_SERVER}/category-blog`,

  // Comment
  comments: `${API_SERVER}/comments`,

  // Review
  reviews: `${API_SERVER}/reviews`,
  // Banner
  banner: `${API_SERVER}/banner`,

  // License
  license: `${API_SERVER}/license`,

  // Withdraw
  withdraw: `${API_SERVER}/withdraw`,

  //Modeling Pricing
  modelingPricing: `${API_SERVER}/modeling-price`,

  // Modeling banner
  modelingBanner: `${API_SERVER}/modeling-banner`,

  //Modeling Customer
  customer: `${API_SERVER}/modeling-customer`,
  modelingServiceOrders: `${API_SERVER}/modeling-order/cms`,

  //Modeling Step
  step: `${API_SERVER}/modeling-step`,

  //Modeling Faq
  faq: `${API_SERVER}/modeling-faq`,

  // Modeling product
  modelingProduct: `${API_SERVER}/modeling-product/cms`,

  //Order Feedback
  modelingServiceListFeedback: `${API_SERVER}/modeling-order/cms/order/product/feedback`,

  // Dashboard
  dashboard: `${API_SERVER}/dashboard`,

  // Notification
  notification: `${API_SERVER}/notifications-cms`,
});

export default apiConstant;
