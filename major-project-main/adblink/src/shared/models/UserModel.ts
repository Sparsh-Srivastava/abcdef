interface LoginInDetails {
	email: string;
	password: string;
}

interface SignUpDetails extends LoginInDetails {
	name: string;
}

interface User extends LoginInDetails {
	postCreated: number;
}

export type { LoginInDetails, SignUpDetails, User };
