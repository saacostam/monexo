export interface IAuthClient {
	login(
		args: IAuthClientPayload["LoginIn"],
	): Promise<IAuthClientPayload["LoginOut"]>;
}

export interface IAuthClientPayload {
	LoginIn: {
		username: string;
		password: string;
	};
	LoginOut: {
		token: string;
	};
}
