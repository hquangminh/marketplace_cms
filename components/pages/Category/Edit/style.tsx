import styled from 'styled-components';

export const styleInput = styled.div`
  position: relative;

  .isShow {
    opacity: 1;
    pointer-events: initial;
  }

  .isHidden {
    pointer-events: none;
  }
`;
