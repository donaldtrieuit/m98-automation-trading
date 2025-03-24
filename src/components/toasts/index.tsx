import { Bounce, toast, ToastOptions } from 'react-toastify';

const configDefault: ToastOptions = {
	position: 'top-right',
	autoClose: 2000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'colored',
	transition: Bounce,
};
export const Toasts = {
	success: (content: string, onCallBack?: any, config?: ToastOptions) => {
		return toast.success(content, {
			...{ ...configDefault, ...config },
			onClose: onCallBack,
		});
	},
	error: (content: string, onCallBack?: any, config?: ToastOptions) => {
		return toast.error(content, {
			...{ ...configDefault, ...config },
			onClose: onCallBack,
		});
	},
};
