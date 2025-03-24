import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Layout, theme } from 'antd';
import { Trans, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import backgroundImage from '@assets/images/background-image.png';
import { emailRegex } from '@utils';
import Image from '@components/image';
import VerifyEmailView from '@pages/register/components/VerifyEmailView';

const { useToken } = theme;

interface Params {
	username?: string;
	email?: string;
	password?: string;
	message?: string;
}

const RegistrationPage = withTranslation()(({ t }) => {
	const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [errors, setErrors] = useState<Params>({});
	const [form] = Form.useForm();
	const { token } = useToken();

	return (
		<Layout className="h-screen bg-white" style={{ color: token.colorTextBase }}>
			<div className="h-full grid grid-cols-12">
				<div
					className="bg-cover bg-left-top h-full w-full bg-no-repeat hidden xl:block xl:col-span-6"
					style={{ backgroundImage: `url(${backgroundImage})` }}
				/>

				<div className="md:px-[70px] p-[16px] 2xl:py-[15px] col-span-12 xl:col-span-6 h-full flex flex-col gap-4">
					<div className="flex-1 w-full flex justify-center items-center">
						{registerSuccess ? (
							<VerifyEmailView
								className="w-full card-primary py-[32px] lg:px-[48px] max-w-[539px] text-center"
								email={form.getFieldValue('email') || 'abc@gmail.com'}
							/>
						) : (
							<div className="w-full max-w-xl">
								<div className="text-center mb-[30px] 2xl:mb-[17px] h-[100px] w-auto flex justify-center">
									<Image src="/images/logo.png" alt="Logo" />
								</div>
								<p className="text-center mb-[26px] text-secondary text-[16px]">
									{t('sign_up_your_account')}
								</p>
								<Form form={form} onValuesChange={() => setErrors({})}>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
										<div>
											<Form.Item
												name="username"
												rules={[
													{
														required: true,
														message: t('input_your_username_required'),
													},
													{
														max: 150,
														message: t('username_too_long', { max: 150 }),
													},
													{
														pattern: /^[\w.@+-]+$/,
														message: t('username_invalid'),
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
													placeholder={t('input_username_placeholder')}
													data-qa="username-input"
												/>
											</Form.Item>
										</div>
										<div>
											<Form.Item
												name="email"
												rules={[
													{ required: true, message: t('input_your_email') },
													{
														pattern: emailRegex,
														message: t('email_invalid'),
													},
												]}
												validateStatus={errors.email ? 'error' : undefined}
												help={errors.email}
											>
												<Input
													placeholder="hello@example.com"
													data-qa="register-email-input"
													prefix={
														<Image
															className="rounded-none mr-2"
															src={`/images/sign-up/email-light.svg`}
															alt="imageAlt"
														/>
													}
												/>
											</Form.Item>
										</div>
									</div>
									<div>
										<Form.Item
											name="password"
											rules={[
												{
													required: true,
													message: t('pass_warning'),
												},
												{
													min: 8,
													message: t('pass_too_short'),
												},
												{
													pattern: /(?=.*?[A-Z]).*/,
													message: t('Password must contain at least 1 uppercase'),
												},
												{
													pattern: /(?=.*[!@#$%^&*])/,
													message: t('Password must contain special character'),
												},
												{
													pattern: /(?=.*?[0-9]).*/,
													message: t('Password must contain at least one number'),
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
												data-qa="register-password-input"
												placeholder={t('input_password_register_placeholder')}
											/>
										</Form.Item>
									</div>
									<div>
										<Form.Item
											name="confirm_password"
											rules={[
												{
													required: true,
													message: t('confirm_pass_warning'),
												},
												({ getFieldValue }) => ({
													validator(_, value) {
														if (!value || getFieldValue('password') === value) {
															return Promise.resolve();
														}
														return Promise.reject(new Error(t('confirm_pass_not_match')));
													},
												}),
											]}
										>
											<Input.Password
												prefix={
													<Image
														className="rounded-none mr-2"
														src={`/images/sign-up/password-light.svg`}
														alt="imageAlt"
													/>
												}
												data-qa="register-password-repeat-input"
												placeholder={t('repeat_password')}
											/>
										</Form.Item>
									</div>
									<div>
										<Form.Item
											name="tos_consent"
											className="mb-0"
											valuePropName="checked"
											rules={[
												() => ({
													validator(_, value) {
														if (value) {
															return Promise.resolve();
														}
														return Promise.reject(
															new Error(
																t(
																	'Please read carefully and agree with the terms and conditions before using Our Service'
																)
															)
														);
													},
												}),
											]}
										>
											<Checkbox className="check-box-trans text-[14px] font-normal text-secondary">
												<Trans
													i18nKey="tos_consent"
													components={{
														tos: (
															<Link
																to="/term-of-use"
																className="underline"
																target="_blank"
															>
																<a className="underline" rel="noreferrer" />
															</Link>
														),
														privacy: (
															<Link
																to="/privacy-policy"
																className="underline"
																target="_blank"
															>
																<a className="underline" rel="noreferrer" />
															</Link>
														),
													}}
												/>
											</Checkbox>
										</Form.Item>
									</div>
									<Button
										type="primary"
										htmlType="submit"
										className="w-full py-2 mt-10 2xl:mt-5 button-primary h-[42px] text-[16px] shadow-none"
										loading={submitting}
										data-qa="sign-up-button"
									>
										{t('sign_up')}
									</Button>

									<div className="text-center mt-4">
										<p className="text-secondary">
											{t('already_have_an_account')}{' '}
											<Link className="underline" to="/login" data-qa="sign-in-link">
												{t('sign_in')}
											</Link>
										</p>
									</div>
								</Form>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
});

export default RegistrationPage;
