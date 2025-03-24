import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Layout } from 'antd';
import backgroundImage from '../../assets/images/background-image.png';
import { useResponsive } from '@hooks/useResponsive';
import Image from '@components/image';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import authStore from '@stores/AuthStore';
import tokenStore from '@stores/TokenStore';

interface Params {
	username?: string;
	password?: string;
	message?: string;
}

const LoginPage = withTranslation()(({ t }) => {
	const [errors, setErrors] = useState<Params>({});
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const { isSmallScreen } = useResponsive();

	const handleSubmit = async (values: FormData) => {
		console.log(values);
		setLoading(true);
		setInterval(() => {
			setLoading(false);
			tokenStore.setToken('123456');
			navigate('/dashboard');
		}, 2000);
	};

	return (
		<Layout className="h-screen bg-white xl:bg-[#F6F8FB]">
			<div className="h-full grid grid-cols-12">
				<div
					className="bg-cover h-full w-full bg-no-repeat bg-top hidden xl:block xl:col-span-6"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				/>
				<div className="md:px-[70px] md:py-[30px] p-[16px] col-span-12 xl:col-span-6 h-full flex flex-col gap-4">
					<div className="flex justify-center items-center flex-1">
						<div
							className={`${!isSmallScreen ? '!p-8 card-primary' : ''} p-[16px] lg:p-[48px] lg:w-[500px]`}
						>
							<div className="mb-4 mx-auto flex justify-center h-[100px]">
								<Image src="/images/logo.png" alt="Logo" />
							</div>
							<p className={`text-[#000] text-center mb-[44px] text-[16px]`}>
								{t('sign_in_your_account')}
							</p>
							<Form onFinish={handleSubmit} form={form} onValuesChange={() => setErrors({})}>
								<Form.Item
									name="username"
									rules={[
										{
											required: true,
											message: t('email_warning'),
										},
									]}
									validateStatus={errors.username ? 'error' : undefined}
									help={errors.username}
								>
									<Input
										prefix={
											<Image
												className="rounded-none mr-2"
												src={`/images/sign-up/username-light.svg`}
												alt="imageAlt"
											/>
										}
										placeholder={t('input_your_username')}
										data-qa="username-input"
									/>
								</Form.Item>

								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: t('password_warning'),
										},
									]}
									validateStatus={errors.password ? 'error' : undefined}
									help={errors.password}
								>
									<Input.Password
										prefix={
											<Image
												className="rounded-none mr-2"
												src={`/images/sign-up/password-light.svg`}
												alt="imageAlt"
											/>
										}
										data-qa="password-input"
										placeholder={t('input_your_password')}
									/>
								</Form.Item>

								{/*{error && (*/}
								{/*	<div className="form-row d-flex justify-content-between mt-4 mb-2">*/}
								{/*		<p className="text-[red]">{error}</p>*/}
								{/*	</div>*/}
								{/*)}*/}

								<div className="flex justify-between items-center md:px-[17px]">
									<Checkbox>
										<span
											className={`${
												!isSmallScreen
													? 'text-[14px] leading-[22px]'
													: 'text-[12px] leading-[20px]'
											} text-secondary text-[#58667E]`}
										>
											{t('Remember my preference')}
										</span>
									</Checkbox>
									<a
										href="/forgot-password"
										className={`${
											!isSmallScreen ? 'text-[14px] leading-[22px]' : 'text-[12px] leading-[20px]'
										} underline text-secondary text-[#58667E] text-right`}
										data-qa="forgot-password-link"
									>
										{t('forgot_your_password')}
									</a>
								</div>
								<Form.Item className="mb-0 mt-[45px]">
									<Button
										className="button-primary h-[42px] w-full font-semibold text-[16px] shadow-none"
										type="primary"
										htmlType="submit"
										loading={loading}
										data-qa="login-button"
									>
										{t('sign_me_in')}
									</Button>
								</Form.Item>
								<div className="text-center mt-4">
									<p className="text-secondary">
										{t('dont_have_an_account')}{' '}
										<a
											href="/sign-up"
											className="underline text-secondary text-[14px]"
											data-qa="sign-in-link"
										>
											{t('sign_up')}
										</a>
									</p>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
});

export default LoginPage;
