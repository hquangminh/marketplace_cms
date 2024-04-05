import { useState } from 'react';
import { Button, Checkbox, Col, Form, FormInstance, Modal, Row, Upload } from 'antd';

import { UploadOutlined, DeleteOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';

import { ProductFileFormat } from 'common/constant';

import { fromEventNormFile } from 'common/functions';

import { typeImg } from 'models/category.model';
import { FormatFileType } from 'models/product.model';

import styled from 'styled-components';

type Props = {
  fileLists: FormatFileType;
  fileDetails: string[];
  setFileLists: React.Dispatch<
    React.SetStateAction<{
      [key: string]: typeImg[];
    }>
  >;
  setFileDetails: React.Dispatch<React.SetStateAction<string[]>> | any;
  form: FormInstance;
  // eslint-disable-next-line no-unused-vars
  onRemoveFile: (e: any, name: string) => void;
  isDraft: boolean;
  type?: 'view' | '';
};

const Includes3DFormatsComponent = (props: Props) => {
  const {
    fileDetails,

    setFileDetails,

    form,
    fileLists,
    setFileLists,
    onRemoveFile,
    isDraft,
    type,
  } = props;

  const [isShowModal, setIsShowModal] = useState(false);

  const onChangeFileTypes = (e: any) => {
    if (e.target.checked) {
      setFileLists((prevState) => ({
        ...prevState,
        [e.target.value]: [],
      }));

      setFileDetails((prevState: string[]) => [...prevState, e.target.value]);
    } else {
      setFileDetails((prevState: string[]) =>
        prevState.filter((item: string) => item !== e.target.value)
      );

      form.setFieldsValue({ [e.target.value]: undefined });

      setFileLists((prevState) => {
        const copy = { ...prevState };
        delete copy[e.target.value];
        return copy;
      });
    }
  };

  return (
    <Includes3DFormats_wrapper className='content'>
      <Form.Item name='checkErrModel'>
        <h3 className='title__line d-flex align-items-center '>
          Upload Models
          <Button
            type='primary'
            icon={<PlusOutlined />}
            disabled={type === 'view'}
            className='btn__add__file ml-4'
            onClick={() => setIsShowModal(true)}>
            Add files
          </Button>
        </h3>
      </Form.Item>

      {fileDetails?.length > 0 && (
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <div className='file__details--wrapper'>
              <div className='file__details--item'>
                {fileDetails.map((item) =>
                  item === 'USDZ' ? (
                    ''
                  ) : (
                    <Form.Item
                      name={item}
                      label={item}
                      key={item}
                      className='ant-upload_my-custom ant-upload-file_my-custom'
                      getValueFromEvent={(e) =>
                        fromEventNormFile({
                          file: e.target.files[0],
                          name: item,
                          form,
                          setFileList: setFileLists,
                          isUpdate: form.getFieldValue('isUpdate'),
                          type: [item.toLowerCase(), 'zip'],
                          multiple: true,
                          ruleSize: 9999999999,
                          typeUpload: 'file',
                        })
                      }
                      rules={[
                        {
                          required: isDraft ? false : true,
                          message: `${item} file is required`,
                        },
                      ]}>
                      <span id={item}>
                        {fileLists[item] && fileLists[item][0]?.image ? (
                          <div className='image_wrapper image_wrapper--file'>
                            <PaperClipOutlined />
                            <p>
                              <abbr title={fileLists[item][0]?.filename}>
                                {fileLists[item][0]?.filename}
                              </abbr>
                            </p>
                            <Button
                              className='btn-delete'
                              disabled={type === 'view'}
                              onClick={(e) => onRemoveFile(e, item)}>
                              <DeleteOutlined />
                            </Button>
                          </div>
                        ) : (
                          <Upload
                            showUploadList={false}
                            maxCount={1}
                            disabled={type === 'view'}
                            accept={`.${item.toLowerCase()}, .zip`}>
                            <Button className='d-flex align-items-center' icon={<UploadOutlined />}>
                              Upload {item} file
                            </Button>
                          </Upload>
                        )}
                      </span>
                    </Form.Item>
                  )
                )}
              </div>
            </div>
          </Col>

          <div className='mt-4 w-100' />
        </Row>
      )}

      <Modal
        title='Add type file'
        visible={isShowModal}
        footer=''
        onCancel={() => setIsShowModal(false)}>
        <Modal__file__details>
          {ProductFileFormat.map((item) => {
            return (
              <div className='file__details--item' key={item.title}>
                <Checkbox
                  checked={fileDetails.includes(item.value)}
                  onChange={onChangeFileTypes}
                  value={item.value}>
                  {item.title}
                </Checkbox>
              </div>
            );
          })}
        </Modal__file__details>
      </Modal>
    </Includes3DFormats_wrapper>
  );
};

const Includes3DFormats_wrapper = styled.div`
  height: calc(100% - 20px);

  .file__details--item {
    display: flex;
    flex-flow: column wrap;
    max-height: 700px;
  }

  abbr {
    cursor: initial;
    text-decoration: initial;
  }

  .file__details--wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .btn__add__file {
    display: flex;
    align-items: center;
  }

  .ant-form-item-control-input-content {
    width: 50%;
    flex: 50%;

    .ant-upload.ant-upload-select {
      > span {
        button {
          display: flex !important;
          justify-content: center !important;
          width: 182px;
          padding: 10px;

          span:not(.anticon) {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .image_wrapper p {
    white-space: nowrap;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Modal__file__details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 10px;

  .ant-checkbox-wrapper {
    width: 100%;
    flex: 1;
  }
`;

export default Includes3DFormatsComponent;
