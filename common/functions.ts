import { message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';

import ErrorCode from 'api/error-code';

import { validationUploadFile } from './constant';

import { typeImg } from 'models/category.model';
import { optionsType } from 'models/common.model';
import { FromEventNormFileType } from 'models/function.model';
import { Config3DModelType } from 'models/product.model';
import { NextRouter } from 'next/router';

export const changeToSlug = (text: string) => {
  text = text.toString().toLowerCase();

  // Convert Vietnamese to Alphabet
  text = text.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  text = text.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  text = text.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  text = text.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  text = text.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  text = text.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  text = text.replace(/(đ)/g, 'd');

  text = text.replace(/\s+/g, '-'); // Replace spaces with -
  text = text.replace(/[^\w\-]+/g, ''); // Remove all non-word chars
  text = text.replace(/\-\-+/g, '-'); // Replace multiple - with single -
  text = text.replace(/^-+/, ''); // Trim - from start of text
  text = text.replace(/-+$/, ''); // Trim - from end of text

  return text;
};

export const formatNumber = (value: number, unit?: string, messErr?: string) => {
  if (Number.isFinite(value)) return (unit || '') + new Intl.NumberFormat('ja-JP').format(value);
  else return messErr || '';
};

export const listToTree = (data: Array<any>, options?: optionsType) => {
  if (!data) return [];

  // options = options || {};
  var ID_KEY = options?.idKey || 'id';
  var PARENT_KEY = options?.parentKey || 'parentid';
  var CHILDREN_KEY = options?.childrenKey || 'children';

  var map: any = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][ID_KEY]) {
      map[data[i][ID_KEY]] = data[i];
      data[i][CHILDREN_KEY] = [];
    }
  }

  for (var i = 0; i < data.length; i++) {
    if (data[i][PARENT_KEY]) {
      // is a child
      if (map[data[i][PARENT_KEY]]) {
        // for dirty data
        map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
        data.splice(i, 1); // remove from root
        i--; // iterator correction
      } else {
        data[i][PARENT_KEY] = 0; // clean dirty data
      }
    }
  }

  return data;
};

export const handlerMessage = (
  err: string,
  type: 'info' | 'error' | 'success' | 'warning',
  duration?: number,
  key?: string
) => {
  message.open({ type, content: err || 'Oops! An error occurred!', key, duration });
};

export const getCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
};

export const setCookie = (name: string, value: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value}; path=/`;
  }
};

export const removeCookie = (lists: string[]) => {
  if (typeof window !== 'undefined') {
    lists.forEach((list: string) => {
      document.cookie = `${list}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
  }
};

export const isStrEmpty = (str: string) => {
  return (
    typeof str !== 'string' ||
    str === undefined ||
    str === null ||
    str.length === 0 ||
    str.trim().length === 0
  );
};

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const onBeforeUploadFile = (props: {
  file: RcFile;
  callBack?: any;
  ruleType?: string[];
  ruleSize?: number;
  msgError?: string;
}) => {
  const { file, callBack, ruleType = validationUploadFile.image, ruleSize = 2, msgError } = props;

  const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';

  const isAllowType = ruleType.some(
    (ext) => ext.toLowerCase() === fileExtension || ext.toLowerCase() === file.type
  );

  let isLimitSize = file.size / 1024 / 1024 < ruleSize;

  if (!isAllowType || !isLimitSize) {
    handlerMessage(
      msgError ?? 'Image must be JPG, WEBP, PNG, JPEG and less than 2MB',
      'error',
      undefined,
      'upload'
    );
    return Upload.LIST_IGNORE;
  }

  if (isAllowType && isLimitSize && callBack) {
    callBack(file);
  }

  return false;
};

export const onBeforeUploadFileWithForm = (props: {
  file: RcFile;
  ruleType?: string[];
  ruleSize?: number;
  msgError?: string;
  typeUpload?: 'file';
}) => {
  const { file, ruleType = validationUploadFile.image, ruleSize = 2, msgError, typeUpload } = props; // set default size limit to 2MB

  let type = '';
  if (typeUpload === 'file') {
    type = file.name.split('.').pop()?.toLowerCase() || '';
  } else {
    type = file.type;
  }

  let isAllowType = true;
  isAllowType = ruleType.some((allowedType) => {
    if (allowedType.endsWith('/*')) {
      const allowedCategory = allowedType.split('/')[0];
      const fileTypeCategory = type.split('/')[0];
      return allowedCategory === fileTypeCategory;
    }
    return allowedType === type;
  });

  let isLimitSize = true;

  if (file.type.startsWith('video')) {
    isLimitSize = file.size / 1024 / 1024 < 5;
  } else {
    isLimitSize = file.size / 1024 / 1024 < ruleSize;
  }

  let isEmptySize = Boolean(file.size === 0);

  if (isEmptySize) {
    message.error('File is empty! Please select a valid file');
  }

  if (!isLimitSize || !isAllowType) {
    if (typeUpload === 'file') {
      handlerMessage(
        msgError || `File must be ${ruleType.join(', ').toUpperCase()} and less than ${ruleSize}MB`,
        'error'
      );
    } else {
      handlerMessage(
        msgError || 'Image must be JPG, WEBP, PNG, JPEG, GIF and less than 2MB',
        'error'
      );
    }
  }

  return isAllowType && isLimitSize && !isEmptySize;
};

// Delete key null, undefined Object
export const deleteItemInObject = (object: object[] | any) => {
  Object.keys(object).forEach((key) =>
    object[key] === null || object[key] === undefined ? delete object[key] : {}
  );

  return object;
};

export const capitalizeFirstLetter = (text: string) => {
  if (text) return text.slice(0, 1).toUpperCase() + text.slice(1);
  else return '';
};

export const checkIsAdmin = (permission: any) => {
  let isAdmin = false;

  if (permission && typeof permission === 'object')
    for (const key in permission) {
      for (const key2 in permission[key]) {
        if (permission[key][key2]) isAdmin = true;
        else {
          isAdmin = false;
          break;
        }
      }
      if (!isAdmin) break;
    }
  return isAdmin;
};

export const checkAnyRole = (permis: any, page: string) => {
  if (!permis[page]) return false;

  return (
    permis[page]['list'] || permis[page]['read'] || permis[page]['write'] || permis[page]['remove']
  );
};

export const checkPermission = (path: string, permission: any) => {
  const isAdmin = checkIsAdmin(permission);

  let pathname = path;
  if (pathname.startsWith('/brands')) pathname = '/category' + pathname.split('/brands')[1];

  const pagePublic = pathname === '/' || pathname === '/profile';

  if (!permission[pathname.split('/')[1]] && !pagePublic && !isAdmin) {
    return false;
  }

  const checkCategory =
    (pathname === '/category' && permission.category?.list) ||
    ((pathname === '/category/create' || pathname === '/category/edit/[brandsId]') &&
      permission.category?.write);

  const checkProduct =
    (pathname.startsWith('/products') &&
      ['hotest', 'newest', 'popular', 'search', 'comments', 'reviews'].findIndex((i) =>
        pathname.includes(i)
      ) !== -1 &&
      permission.products?.list) ||
    ((pathname === '/products/create' || pathname === '/products/edit/[productId]') &&
      permission.products.write) ||
    (pathname === '/products/view/[productId]' && permission.products.read);

  const checkUser =
    ((pathname === '/users' || pathname === '/users/search') && permission.users?.list) ||
    (pathname === '/users/[userId]' && permission.users.read);

  const checkOrder =
    ((pathname === '/orders' || pathname === '/orders/search') && permission.orders?.list) ||
    (pathname === '/orders/[orderId]' && permission.orders.read);

  const checkCoupon = pathname === '/coupons' && permission.coupons?.list;

  const checkMedia = pathname === '/media' && permission.media?.list;

  const checkHelp =
    (pathname === '/help' && permission.help?.list) ||
    (pathname === '/help/category' && permission.help?.list) ||
    (pathname === '/help/view/[helpId]' && permission.help.read) ||
    ((pathname === '/help/create' || pathname === '/help/edit/[helpId]') && permission.help.write);

  const checkBlog =
    (pathname === '/blog' && permission.blog?.list) ||
    (pathname === '/blog/view/[blogId]' && permission.blog.read) ||
    ((pathname === '/blog/create' || pathname === '/blog/edit/[blogId]') &&
      permission.blog.write) ||
    (pathname === '/blog/category' && permission.blog?.list);

  const checkBanner = pathname === '/banner' && permission.banner?.list;
  const checkLicense = pathname === '/license' && permission.license?.list;
  const checkWithdraw = pathname === '/withdraw' && permission.withdraw?.list;

  const checkSeo =
    (pathname === '/seo' && permission.seo?.list) ||
    (pathname === '/seo/view/[page]' && permission.seo.read) ||
    (pathname === '/seo/create' && permission.seo.write) ||
    (pathname === '/seo/edit/[page]' && permission.seo.write);

  const checkShowroom = pathname === '/showroom/create' && permission.showroom?.write;

  return (
    isAdmin ||
    pagePublic ||
    checkCategory ||
    checkProduct ||
    checkUser ||
    checkOrder ||
    checkCoupon ||
    checkMedia ||
    checkHelp ||
    checkBlog ||
    checkBanner ||
    checkLicense ||
    checkSeo ||
    checkWithdraw ||
    checkShowroom
  );
};

// Search Debounce
export const searchDebounce = (func: (e: any) => void, timeout = 300) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};

export const fromEventNormFile = (props: FromEventNormFileType) => {
  const {
    file,
    name,
    form,
    setFileList,
    isUpdate,
    multiple,
    type,
    typeUpload,
    ruleSize,
    msgError,
    onSendModelToViewer,
  } = props;

  if (onBeforeUploadFileWithForm({ file, ruleType: type, ruleSize, msgError, typeUpload })) {
    if (typeUpload === 'file') {
      if (multiple) {
        setFileList((prevState: { [key: string]: typeImg[] } | typeImg[]) => ({
          ...prevState,
          [name]: [
            {
              image: 'url',
              name: file.name,
              filename: file.name,
              filetype: file.type,
              fileUpload: file,
              isUpdate: isUpdate,
            },
          ],
        }));
      } else {
        setFileList([
          {
            image: 'url',
            name: file.name,
            filename: file.name,
            filetype: file.type,
            fileUpload: file,
            isUpdate: isUpdate,
          },
        ]);
      }
      if (onSendModelToViewer) {
        onSendModelToViewer('model', file);
      }
    } else {
      getBase64(file as RcFile, (url) => {
        if (multiple) {
          setFileList((prevState: { [key: string]: typeImg[] } | typeImg[]) => ({
            ...prevState,
            [name]: [
              {
                image: url,
                name: file.name,
                filename: file.name,
                filetype: file.type,
                fileUpload: file,
                isUpdate: isUpdate,
              },
            ],
          }));
        } else {
          setFileList([
            {
              image: url,
              name: file.name,
              filename: file.name,
              filetype: file.type,
              fileUpload: file,
              isUpdate: isUpdate,
            },
          ]);
        }
      });
    }

    return [[{ image: '', filename: file.name, filetype: file.type }]];
  } else {
    if (form.getFieldValue(name)) {
      return [{ image: '', filename: file.name, filetype: file.type }];
    }
  }
};

export const decimalPrecision = (number: number, place: number) => {
  return parseFloat(number.toFixed(place));
};

export const renderFileSize = (bytes?: number, si = false, dp = 1) => {
  if (!bytes) return;

  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
};

export const onToastNoPermission = () => {
  return handlerMessage(ErrorCode.PERMISSION_DENIED, 'error');
};

// Fake id using remove list item
export const generatorUUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

// prettier-ignore
export const convertParamsUrlProduct = (params?: Config3DModelType | {} | any) => {
  if(!params) return ''
  let str = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&').replace(/#/g, '').replace(/&$/, '');
  return str
};

// Calculator percent increase, reduced
export const perIncrease = (thisNum: number, lastNum: number) => {
  let percent = 0;

  if (thisNum > lastNum) {
    if (lastNum === 0) {
      percent = thisNum * 100;
    } else {
      percent = ((thisNum - lastNum) / lastNum) * 100;
    }
  } else if (thisNum === lastNum) {
    percent = 0;
  } else {
    if (lastNum === 0) lastNum = 1;

    percent = 100 - (thisNum / lastNum) * 100;
  }

  if (Number.isInteger(percent)) {
    return percent;
  }

  return percent.toFixed(2);
};

export const isUrlImage = (url: string) => {
  const isExtensionImage = /\.(jpg|jpeg|png|webp|avif|gif|svg|raw|bmp)$/i.test(url);
  const isImageBase64 = /\/(jpg|jpeg|png|webp|avif|gif|svg|raw|bmp)$/i.test(url.split(';')[0]);
  return isExtensionImage || isImageBase64;
};

export default function convertS3Link(link: string) {
  return link?.includes('amazonaws.com/vrstyler')
    ? 'https://resources.archisketch.com/vrstyler' +
        link.split('amazonaws.com/vrstyler').slice(1).join('')
    : link;
}

export const onCheckErrorApiMessage = (error: any, message?: string) => {
  let content = ErrorCode[error.data?.error_code] ?? message ?? error.data?.message;
  if (error.code === 'ERR_NETWORK' && error.name === 'AxiosError')
    content = ErrorCode['DISCONNECT_INTERNET'];
  else if (error.status === 401) {
    if (content) handlerMessage(content, 'error');
    location.href = `/login?urlBack=${location.pathname}&error=${error.data?.error_code}`;
  }

  if (content) handlerMessage(content, 'error');
};
