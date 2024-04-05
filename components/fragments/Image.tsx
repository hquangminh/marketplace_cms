import convertS3Link from 'common/functions';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

type ImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  imgErr?: string;
};
const MyImage = (props: ImageProps) => {
  const image = convertS3Link(props.src || '');
  const imageError =
    props.imgErr ||
    'https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1685670581903_252929/image-available.png';

  const src = image || imageError;

  return (
    <img {...props} src={src} alt={props.alt} onError={(e) => (e.currentTarget.src = imageError)} />
  );
};
export default MyImage;
