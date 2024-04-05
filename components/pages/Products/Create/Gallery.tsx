import { Form, Upload } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';

import { onBeforeUploadFile } from 'common/functions';
import { validationUploadFile } from 'common/constant';

import { GalleryProps } from 'models/product.model';
import { typeImg } from 'models/category.model';

import styled from 'styled-components';

const GalleryComponent = ({ galleryLists, setGalleryLists, onRemoveGallery }: GalleryProps) => {
  const onCallBackBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setGalleryLists((prevState: typeImg[]) => [
        ...prevState,
        {
          image: reader.result,
          url: reader.result,
          filetype: file.type,
          filename: file.name,
          name: file.name,
          fileType: file.type,
        },
      ]);
    };
  };

  return (
    <Gallery_wrapper className='position-relative content'>
      <h3 className='title__line'>Upload Gallery</h3>
      <Form.Item name='gallery' label='' noStyle></Form.Item>

      <Upload.Dragger
        beforeUpload={(file) => onBeforeUploadFile({ file, callBack: onCallBackBeforeUpload })}
        multiple
        listType='picture'
        maxCount={4}
        showUploadList={false}
        accept={validationUploadFile.image.toString()}
        className='ant-upload_my-custom'>
        <p className='ant-upload-drag-icon'>
          <CloudUploadOutlined />
        </p>
        <p className='ant-upload-text'>Drop image here or click to upload</p>
      </Upload.Dragger>

      {galleryLists?.map((item) => (
        <div className='custom__list--img mt-3' key={item.image}>
          <div className='list--item d-flex align-items-center justify-content-between p-2'>
            <div className='box__img d-flex align-items-center'>
              <img src={item?.image} alt='' />
              <span>{item?.filename}</span>
            </div>
            <DeleteOutlined onClick={() => onRemoveGallery(item)} />
          </div>
        </div>
      ))}
    </Gallery_wrapper>
  );
};

const Gallery_wrapper = styled.div`
  & > span {
    display: block;
  }
  .custom__list--img {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .list--item {
    gap: 20px;
    border: 1px solid #d9d9d9;
  }

  .box__img {
    gap: 5px;

    span {
      word-break: break-all;
    }

    img {
      width: 48px;
      height: 48px;
      border-radius: 2px;
    }
  }
  .anticon-delete {
    color: #ff4d4f;
    cursor: pointer;
  }
`;

export default GalleryComponent;
