import React from 'react';
import styled from 'styled-components';

const StyleWrapperDatePicker = styled.div`
	.ant-picker-panel {
		&:first-child {
			@media (max-width: 576px) {
				.ant-picker-header {
					.ant-picker-header-next-btn,
					.ant-picker-header-super-next-btn,
					.ant-picker-header-view {
						visibility: initial !important;
					}
				}
			}

			@media (min-width: 768px) {
				.ant-picker-header {
					.ant-picker-header-next-btn,
					.ant-picker-header-super-next-btn {
						visibility: hidden !important;
					}
				}
			}
		}
		&:last-child {
			@media (max-width: 768px) {
				width: 0;
				.ant-picker-header {
					position: absolute;
					right: 0;
					.ant-picker-header-view,
					.ant-picker-header-prev-btn,
					.ant-picker-header-next-btn,
					.ant-picker-header-super-prev-btn,
					.ant-picker-header-super-next-btn {
						display: none !important;
					}
				}

				.ant-picker-body {
					display: none;
				}
			}
		}
	}
`;
export const panelRender = (panelNode: any) => <StyleWrapperDatePicker>{panelNode}</StyleWrapperDatePicker>;
