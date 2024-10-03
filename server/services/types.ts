/**
 * Here lies typescript types and interfaces
 */

export interface ServerAnswer {
	message: string;
	payload: any | undefined;
}

export interface Account {
	email: string;
	password: string;
	is_admin?: boolean;
}
