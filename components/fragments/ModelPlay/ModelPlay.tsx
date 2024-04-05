import UploadModelSection from './UploadModelSection';

import styled from 'styled-components';

const ModelPlay = ({ url }: { url: string }) => {
  return (
    <UploadModelSection
      title='Model Demo Viewer'
      tooltip='Drag and drop your file into the viewer below to play the model'>
      <Wrapper
        onMouseMove={() => document.body.classList.add('scroll-disabled')}
        onMouseLeave={() => document.body.classList.remove('scroll-disabled')}>
        <iframe className='model-viewer' src={url} />
      </Wrapper>
    </UploadModelSection>
  );
};
export default ModelPlay;

const Wrapper = styled.div`
  .model-viewer {
    width: 100%;
    height: 67vh;
  }
`;
