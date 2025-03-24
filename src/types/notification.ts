export type Notification = {
	id: number,
	level: 'info' | 'warning' | 'error', // Assuming possible values
	unread: boolean,
	actor_object_id: string | null,
	verb: string,
	description: string,
	target_object_id: string | null,
	action_object_object_id: string | null,
	timestamp: string, // Unix timestamp as string
	public: boolean,
	deleted: boolean,
	emailed: boolean,
	data: any | null, // Could be typed further if structure is known
	group: string,
	type: number,
	verb_translate: string | null,
	desc_translate: string | null,
	key_verbose: string,
	key_descript: string,
	format_value_verbose: {
		symbol: string,
		bot_name: string,
		[key: string]: any, // Allow additional fields
	},
	format_value_descript: {
		symbol: string,
		volume: number,
		bot_name: string,
		bought_at: number,
		[key: string]: any, // Allow additional fields
	},
	recipient: number,
	actor_content_type: number | null,
	target_content_type: number | null,
	action_object_content_type: number | null,
	slug: number,
};

export interface NotificationResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Notification[];
}
