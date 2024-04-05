import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

type Props = { name: string; image: string };

export default function TabLanguageItem({ name, image }: Props) {
  return (
    <Wrap>
      {name} <img width='22' src={image} alt='' />
    </Wrap>
  );
}
