import React, { memo, useMemo } from 'react';

import dynamic from 'next/dynamic';

import styled from 'styled-components';

const JoditEditor: any = dynamic(() => import('jodit-react'), { ssr: false });

type Props = {
  /* eslint-disable no-unused-vars */
  height?: number | string;
  // eslint-disable-next-line no-unused-vars
  onChangeEditor?: (value: string) => void;
  valueEditor: string;
  isDisableEditor?: boolean;
  onlyView?: boolean;
};

const TextEditor = (props: Props) => {
  const { valueEditor, onChangeEditor, isDisableEditor, height } = props;

  // Default config buttons
  const config = useMemo(
    () => ({
      height: height || 200,
      readonly: isDisableEditor,
      toolbarSticky: true,
      toolbarButtonSize: 'small',
    }),
    [isDisableEditor, height]
  );

  return (
    <JoditContainer>
      <JoditEditor
        value={valueEditor}
        config={config}
        onBlur={onChangeEditor}
        onChangeEditor={(value: string) => {
          const content = value?.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '') ?? undefined;
          onChangeEditor?.(content);
        }}
      />
    </JoditContainer>
  );
};

export default memo(TextEditor);

const JoditContainer = styled.div`
  .jodit-workplace {
    max-height: 100% !important;
    overflow: hidden;
    overflow-y: auto;
  }
  .jodit_sticky > .jodit-toolbar__box {
    top: 50px;
  }

  .jodit-container {
    .jodit-wysiwyg {
      background-color: #fff;
      overflow-y: scroll;
    }

    &.jodit-jodit_fullsize_true {
      .jodit-wysiwyg {
        max-height: 100%;
      }
    }
  }

  ul {
    padding: 0 20px 10px;
  }
  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  blockquote {
    background-color: #f3fbfb;
    border-left: 5px solid #b7edf0;
    border-radius: 5px;
    /* box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05), 0px 15px 20px -1px rgba(0, 0, 0, 0.025); */
    margin: 0;
    margin-bottom: 1em;
    padding: 0.8em;
  }
`;
