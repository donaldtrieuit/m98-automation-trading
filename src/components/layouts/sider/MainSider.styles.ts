import styled from 'styled-components';
import { Menu as BaseMenu } from 'antd';

export const Menu = styled(BaseMenu)`
	background: transparent;
	border-inline-end: 0 !important;
	flex: 1 1 0 !important;

	a {
		width: 100%;
		display: block;
	}

	.ant-menu-submenu-inline {
		.ant-menu-submenu-title {
			color: #a5adcf;
			fill: #a5adcf;
		}

		.ant-menu-item:hover,
		.ant-menu-submenu-title:hover {
			background: linear-gradient(
				85.6deg,
				rgba(73, 118, 205, 0.2) 3.57%,
				rgba(109, 92, 218, 0.14) 115.95%,
				rgba(74, 69, 94, 0) 115.96%
			) !important;

			.ant-menu-submenu-expand-icon,
			.ant-menu-submenu-arrow,
			span[role='img'],
			a,
			.ant-menu-item-icon,
			.ant-menu-title-content {
				color: #ffffff;
				fill: #ffffff;
			}
		}
	}

	.ant-menu-item,
	.ant-menu-submenu {
		font-size: 16px;
		box-sizing: border-box;
		margin: 0 0 8px 0;

		div.ant-menu-submenu-title {
			margin: 0;
		}
	}

	.ant-menu-item-icon {
		width: 20px;
	}

	.ant-menu-submenu-expand-icon,
	.ant-menu-submenu-arrow,
	span[role='img'],
	a,
	.ant-menu-item,
	.ant-menu-submenu {
		color: #a5adcf;
		fill: #a5adcf;
	}

	.ant-menu-item:hover,
	.ant-menu-submenu-title:hover {
		background: linear-gradient(
			85.6deg,
			rgba(73, 118, 205, 0.2) 3.57%,
			rgba(109, 92, 218, 0.14) 115.95%,
			rgba(74, 69, 94, 0) 115.96%
		) !important;

		.ant-menu-submenu-expand-icon,
		.ant-menu-submenu-arrow,
		span[role='img'],
		a,
		.ant-menu-item-icon,
		.ant-menu-title-content {
			color: #ffffff;
			fill: #ffffff;
		}
	}

	.ant-menu-submenu-selected {
		.ant-menu-submenu-title {
			color: #ffffff;

			.ant-menu-submenu-expand-icon,
			.ant-menu-submenu-arrow,
			span[role='img'] {
				color: #ffffff;
				fill: #ffffff;
			}
		}
	}

	.ant-menu-item-selected {
		background: linear-gradient(
			85.6deg,
			rgba(73, 118, 205, 0.4) 3.57%,
			rgba(109, 92, 218, 0.28) 115.95%,
			rgba(74, 69, 94, 0) 115.96%
		) !important;

		.ant-menu-submenu-expand-icon,
		.ant-menu-submenu-arrow,
		span[role='img'],
		.ant-menu-item-icon,
		span {
			color: #ffffff;
			fill: #ffffff;
		}
	}

	.ant-menu-item-active,
	.ant-menu-submenu-active .ant-menu-submenu-title {
		background: transparent !important;
	}

	.ant-menu-submenu-active.ant-menu-submenu-selected .ant-menu-submenu-title {
		background: linear-gradient(
			85.6deg,
			rgba(73, 118, 205, 0.4) 3.57%,
			rgba(109, 92, 218, 0.28) 115.95%,
			rgba(74, 69, 94, 0) 115.96%
		) !important;
	}

	ul.ant-menu-sub {
		border-radius: 8px !important;

		li:last-child {
			margin-bottom: 0 !important;
		}
	}
`;
