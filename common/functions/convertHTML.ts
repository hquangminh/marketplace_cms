function linkify(content: string) {
  const replacePattern1 =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return content
    .replaceAll('<br/>', ' <br/>')
    .replaceAll(/\&nbsp;/g, ' ')
    .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

const commentFunction = (comment: string) => {
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
    else {
      let url = '';

      replacedText += c + `<a class="mention" href="${url}">${arr[i].display}</a>`;
    }
  }

  return linkify(replacedText);
};

export default commentFunction;
