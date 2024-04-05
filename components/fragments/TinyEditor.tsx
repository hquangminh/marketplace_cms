import { useRef, useState } from 'react';
import { Input, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import styled from 'styled-components';

type Props = {
  value?: string;
  height?: number;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (value?: string) => void;
};

export default function TinyEditor({ height, value, disabled, onChange }: Props) {
  const [isReady, setReady] = useState<boolean>(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <EditorWrapper $show={isReady}>
      {!isReady && (
        <Spin>
          <Input.TextArea autoSize={{ minRows: 5 }} disabled />
        </Spin>
      )}
      <Editor
        apiKey='j1ynpgeyjtx3hiaji5u8j6s4hipdbhgcv7lq49bh2rrt1ewn'
        disabled={disabled}
        initialValue={value}
        onInit={(_, editor) => {
          editorRef.current = editor;
          setTimeout(() => setReady(true), 0);
        }}
        init={{
          height: height ?? 300,
          menubar: false,
          entities:
            '169,copy,8482,trade,8211,ndash,8212,mdash,8216,lsquo,8217,rsquo,8220,ldquo,8221,rdquo,8364,euro',
          plugins: [
            'advlist',
            'anchor',
            'autolink',
            'autosave',
            'charmap',
            'code',
            'code',
            'fullscreen',
            'fullscreen',
            'image',
            'insertdatetime',
            'link',
            'lists',
            'media',
            'preview',
            'preview',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'quickbars',
          ],
          toolbar: [
            { name: 'history', items: ['undo', 'redo'] },
            { name: 'styles', items: ['blocks', 'fontfamily', 'fontsizeinput', 'lineheight'] },
            {
              name: 'formatting',
              items: ['bold', 'italic', 'forecolor', 'backcolor', 'link', 'removeformat'],
            },
            { name: 'list', items: ['bullist', 'numlist'] },
            { name: 'alignment', items: ['align'] },
            { name: 'table', items: ['table'] },
            { name: 'media', items: ['image', 'media'] },
            { name: 'time', items: ['insertdatetime'] },
            { name: 'tool', items: ['fullscreen', 'preview', 'help'] },
          ],
          toolbar_mode: 'sliding',
          image_caption: true,
          quickbars_insert_toolbar: false,
          font_family_formats: `
            Default='Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui,Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
            Arial=Arial, sans-serif;
            Verdana=Verdana, sans-serif;
            Tahoma=Tahoma, sans-serif;
            Trebuchet MS='Trebuchet MS', sans-serif;
            Times New Roman='Times New Roman', serif;
            Georgia=Georgia, serif;
            Garamond=Garamond, serif;
            Brush Script MT='Brush Script MT', cursive;`,
          line_height_formats: '1 2 1.1 1.2 1.3 1.4 1.5 1.6 1.7',
          content_style: `
            @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css");
            body {
              font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui,Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
              font-size: 16px;
              line-height: 1.7;
            }
            p {
              margin: 0px;
              margin-bottom: 1em;
            }
            img {
              max-width: 100%;
            }
          `,
        }}
        onBlur={() => onChange(editorRef.current?.getContent())}
      />
    </EditorWrapper>
  );
}

const EditorWrapper = styled.div<{ $show: boolean }>`
  height: ${({ $show }) => ($show ? 'auto' : '120px')};
  .tox-tinymce {
    border-width: 1px;
  }
  textarea,
  .tox.tox-tinymce {
    opacity: ${({ $show }) => ($show ? 1 : 0)};
  }
`;
