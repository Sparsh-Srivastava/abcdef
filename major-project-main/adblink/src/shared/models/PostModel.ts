interface Post {
	id?: string;
	title: string;
	description: string;
	tags: string[];
	file_name: string;
	redirect_url: string;
	created_at?: string;
	owner?: string;
}

export type { Post };
