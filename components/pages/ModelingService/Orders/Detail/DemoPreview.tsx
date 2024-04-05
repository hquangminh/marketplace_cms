import Script from 'next/script';
import styled from 'styled-components';

type Props = { model: string };

export default function DemoPreview(props: Readonly<Props>) {
  const ModelViewer = `
    <model-viewer
      id="modelViewer"
      src="${props.model}"
      autoplay="false"
			environment-image="legacy"
			shadow-softness="0.5"
			exposure="1.2"
			shadow-intensity="1"
			interaction-prompt="none"
			bounds="tight"
			loading="lazy"
			modelCacheSize="0"
			enable-pan
			xr-environment
			camera-controls
      auto-rotate
			rotation-per-second="10deg" />
  `;

  return (
    <>
      <Script type='module' src='https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js' />
      <Script noModule src='https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js' />
      <Script src='https://unpkg.com/focus-visible@5.0.2/dist/focus-visible.js' defer />

      <Wrapper
        className='order-modeling-product-play-demo'
        dangerouslySetInnerHTML={{ __html: ModelViewer }}
      />
    </>
  );
}

const Wrapper = styled.div`
  height: 100%;
  model-viewer {
    width: 100%;
    height: 100%;
  }
`;
