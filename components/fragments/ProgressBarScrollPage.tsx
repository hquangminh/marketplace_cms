import { theme } from 'common/constant';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProgressBarScrollPage = () => {
  const [scroll, setScroll] = useState<number | string>(0);

  useEffect(() => {
    let progressBarHandler = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll: string = `${totalScroll / windowHeight}`;

      setScroll(scroll);
    };

    window.addEventListener('scroll', progressBarHandler);

    return () => window.removeEventListener('scroll', progressBarHandler);
  });

  return (
    <ProgressBar
      id='progressBar'
      style={{ transform: `scale(${scroll}, 1)`, opacity: `${scroll}` }}
    />
  );
};

export default ProgressBarScrollPage;

const ProgressBar = styled.div`
  height: 2px;
  background: ${theme.primary_color};
  transform-origin: top left;
  transform: scale(0, 0);
  opacity: 0;
  transition: transform 100ms ease-out 0s;
`;
