import React from 'react';
import styled from 'styled-components';
import { Link as LinkLib } from 'react-router-dom';
import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { RefAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';

export const Link = styled(LinkLib)`
	font-size: 14px;
	text-decoration: underline !important;
	color: #2180f8;
`;

const { Text: TextLib } = Typography;

export const ErrorText = (props: JSX.IntrinsicAttributes & TextProps & RefAttributes<HTMLSpanElement>) => (
	<TextLib type="danger" {...props} className={`text-xs ${props?.className}`} />
);

export const Text = (props: JSX.IntrinsicAttributes & TextProps & React.RefAttributes<HTMLSpanElement>) => (
	<TextLib {...props} className={`text-[14px] ${props?.className}`} />
);

export const LgText = (props: JSX.IntrinsicAttributes & TextProps & React.RefAttributes<HTMLSpanElement>) => (
	<TextLib {...props} className={`text-[18px] ${props?.className}`} />
);
