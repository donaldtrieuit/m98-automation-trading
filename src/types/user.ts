export type User = {
	user_id: number,
	user_name: string,
	password: string,
	first_name: string,
	last_name: string,
	email: string,
	mobile?: string,
	avatar?: {
		thumb_image_url?: string,
	},
	subscription?: {
		product_name?: string,
	},
};
