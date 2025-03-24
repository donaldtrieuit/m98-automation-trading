import React from 'react';
import { baseUrlApi } from '@utils';

type ImageProps = {
	className?: string,
} & React.ImgHTMLAttributes<HTMLImageElement>;

// eslint-disable-next-line react/prop-types
const Image: React.FC<ImageProps> = ({ className, src, alt, ...props }) => (
	<img src={`${baseUrlApi}${src}`} alt={alt} className={`${className || ''} inline-block`} {...props} />
);

export default Image;
