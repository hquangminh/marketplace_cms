import React, { createElement } from 'react';
import moment from 'moment';

import { Avatar, Comment, Tooltip } from 'antd';
import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';

import { urlPage } from 'common/constant';

import MyImage from 'components/fragments/Image';

import { CommentModel } from 'models/comment.model';

import styled from 'styled-components';

type Props = {
  data: CommentModel;
};

function linkify(content: string) {
  const replacePattern1 =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return content
    .replaceAll('<br/>', ' <br/>')
    .replace(replacePattern1, '<a href="//$1" target="_blank">$1</a>');
}

const convertToHtml = (comment: string) => {
  let regex = /@\[.+?\]\(.+?\)/gm;
  let displayRegex = /@\[.+?\]/g;
  let idRegex = /\(.+?\)/g;
  let matches = comment.match(regex);
  let arr: any = [];
  matches &&
    matches.forEach((m: any) => {
      let id = m.match(idRegex)[0].replace('(', '').replace(')', '');
      let display = m.match(displayRegex)[0].replace('@[', '').replace(']', '');

      arr.push({ id: id, display: display });
    });
  let newComment = comment.split(regex);
  let replacedText = '';
  for (let i = 0; i < newComment.length; i++) {
    const c = newComment[i];
    if (i === newComment.length - 1) replacedText += c;
    else
      replacedText +=
        c +
        `<a class="mention" href="${
          arr[i].id.startsWith('user:')
            ? urlPage.profile.replace('{nickname}', arr[i].id.slice(5))
            : `mailto:${arr[i].display}`
        }">${arr[i].display}</a>`;
  }

  return linkify(replacedText);
};

const CommentItem = (props: Props) => {
  const actions = [
    <CommentAction key='like-commnet' disabled={true}>
      {createElement(LikeOutlined)}
      <span className='comment-action'>{props.data.like_count}</span>
    </CommentAction>,

    <CommentAction key='dislike-commnet' disabled={true}>
      {React.createElement(DislikeOutlined)}
      <span className='comment-action'>{props.data.dislike_count}</span>
    </CommentAction>,
  ];

  return (
    <Comment
      actions={actions}
      author={<CommentAuth>{props.data.market_user.name}</CommentAuth>}
      avatar={
        <Avatar
          src={
            <MyImage
              src={props.data.market_user.image || ''}
              imgErr='/static/images/avatar-default.png'
            />
          }
          alt={props.data.market_user.name}
        />
      }
      content={
        <CommentContent>
          <div
            dangerouslySetInnerHTML={{
              __html: convertToHtml(props.data.content),
            }}
          />
        </CommentContent>
      }
      datetime={
        <Tooltip title={moment(props.data.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
          <CommentDate>{moment(props.data.createdAt).fromNow()}</CommentDate>
        </Tooltip>
      }
    />
  );
};

export default CommentItem;

const CommentAuth = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #369ca5;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #8c8c8c;
`;

const CommentContent = styled.div`
  mention {
    padding: 0 4px;
    border-radius: 2px;
    background-color: #b7edf0;

    a {
      color: #369ca5;
    }
  }
`;

const CommentAction = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 12px;
  color: #8c8c8c;

  cursor: pointer;

  ${(props) => {
    if (props.disabled) return `user-select: none;`;
  }}

  .comment-action {
    line-height: 1;
  }
`;
