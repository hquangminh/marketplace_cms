import { Button, Form, FormInstance, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';

import { fromEventNormFile } from 'common/functions';

import { FormatFileType } from 'models/product.model';

import { typeImg } from 'models/category.model';

import styled from 'styled-components';

type Props = {
  fileLists: FormatFileType;
  form: FormInstance;
  // eslint-disable-next-line no-unused-vars
  onRemoveFile: (e: any, name: string) => void;

  setFileLists: React.Dispatch<
    React.SetStateAction<{
      [key: string]: typeImg[];
    }>
  >;
  isDraft: boolean;
  type?: 'view' | '';
  // eslint-disable-next-line no-unused-vars
  onSendModelToViewer: (type: 'model' | 'cancel', e: any) => void;
};

const PreviewModelComponent = (props: Props) => {
  const { fileLists, form, onRemoveFile, setFileLists, isDraft, type, onSendModelToViewer } = props;

  return (
    <PreviewModelComponent_wrapper>
      <h3 className='title__line'>Demo</h3>
      <Form.Item
        name='DEMO'
        label='Link to the GLTF file (with watermark) to show public on the market'
        className='ant-upload_my-custom ant-upload-file_my-custom'
        getValueFromEvent={(e) => {
          return fromEventNormFile({
            file: e.target.files[0],
            name: 'DEMO',
            type: ['glb'],
            form,
            setFileList: setFileLists,
            ruleSize: 20,
            isUpdate: form.getFieldValue('isUpdate'),
            multiple: true,
            typeUpload: 'file',
            onSendModelToViewer: onSendModelToViewer,
          });
        }}
        rules={[{ required: isDraft ? false : true, message: 'Demo file is required' }]}>
        <span id='DEMO'>
          {fileLists.DEMO && fileLists.DEMO[0]?.image ? (
            <div className='image_wrapper image_wrapper--file'>
              <PaperClipOutlined />
              <p>{fileLists.DEMO[0]?.filename}</p>
              <Button
                className='btn-delete'
                disabled={type === 'view'}
                onClick={(e) => onRemoveFile(e, 'DEMO')}>
                <DeleteOutlined />
              </Button>
            </div>
          ) : (
            <Upload showUploadList={false} maxCount={1} accept={'.glb'} disabled={type === 'view'}>
              <Button
                className='d-flex align-items-center'
                icon={<UploadOutlined />}
                disabled={type === 'view'}>
                Upload (.glb)
              </Button>
            </Upload>
          )}
        </span>
      </Form.Item>
    </PreviewModelComponent_wrapper>
  );
};

const PreviewModelComponent_wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .view-with-color {
    position: relative;
    height: 100%;
    border: 1px solid #ddd;

    .color-picker-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 1;
      width: fit-content;
      padding: 10px;

      .tag-color-model {
        padding: 5px;
        background-color: #fff;
      }
      .sketch-picker {
        margin-top: 10px;
      }
    }
  }
`;

export default PreviewModelComponent;
