import { ReactNode } from 'react';

import Link from 'next/link';

import { Button } from 'antd';

import styled from 'styled-components';

type breadcrumbProps = {
  path?: string;
  title: string;
};
type Props = {
  fullWidth?: boolean;
  title: string;
  subTitle?: string;
  breadcrumb?: breadcrumbProps[];
  isAdd?: boolean;
  addPath?: string;
  btnAdd?: ReactNode;
};

const HeaderPageFragment = (props: Props) => {
  return (
    <Wrapper fullWidth={props.fullWidth}>
      <div className='box'>
        <div className='left'>
          {props.breadcrumb && (
            <div className='ant-breadcrumb'>
              <ol>
                {props.breadcrumb.map((item, index) => {
                  return (
                    <li key={index}>
                      <span className='ant-breadcrumb-link'>
                        {item.path ? <Link href={item.path}>{item.title}</Link> : item.title || ''}
                      </span>
                      {props.breadcrumb && props.breadcrumb[index + 1]?.title ? (
                        <span className='ant-breadcrumb-separator'>/</span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
          <div className='ant-page-header-heading-left'>
            <h1 className='ant-page-header-heading-title'>{props.title}</h1>
            {props.subTitle && (
              <p className='ant-page-header-heading-sub-title'>{props.subTitle}</p>
            )}
          </div>
        </div>
        <div className='right'>
          {props.btnAdd}
          {typeof props.btnAdd === 'undefined' && props.isAdd && (
            <Button type='primary' className='btn-add'>
              <Link href={props.addPath ?? '/'}>Create</Link>
            </Button>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
export default HeaderPageFragment;

const Wrapper = styled.div<{ fullWidth?: boolean }>`
  padding: ${(props) => (props.fullWidth ? '' : '20px 20px 0')};

  .box {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    padding: 10px 20px;

    background-color: #ffffff;

    .btn-add {
      margin-bottom: 4px;
    }
  }
  .ant-page-header-heading-title {
    white-space: normal;
    overflow-wrap: break-word;
  }
`;
