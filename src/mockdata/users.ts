import { User } from '@types';

export const mockUser: User[] = [
	{
		user_id: 1,
		user_name: 'user1',
		password: '123123',
		first_name: 'User1',
		last_name: 'Trader',
		email: 'user1@gmail.com',
		mobile: undefined,
		avatar: {
			thumb_image_url: '/avatar/avatar.jpg',
		},
		subscription: {
			product_name: 'Premium',
		},
	},
	{
		user_id: 2,
		user_name: 'user2',
		password: '123123',
		first_name: 'User2',
		last_name: 'Trader',
		email: 'user2@gmail.com',
		mobile: undefined,
		avatar: {
			thumb_image_url: '/avatar/avatar.jpg',
		},
		subscription: {
			product_name: 'Premium',
		},
	},
];
