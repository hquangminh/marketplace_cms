import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Wrapper = styled.main`
  min-height: 400px;

  .list-card {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    & > div {
      flex: 0 0 calc((100% / 3) - (45px / 3));

      ${maxMedia.medium} {
        flex: 0 calc(50% - 10px);
      }
      ${maxMedia.small} {
        flex: 100%;
      }
    }
  }
`;
