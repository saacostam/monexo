export interface IAuthClient {
	login(
		args: IAuthClientPayload["LoginIn"],
	): Promise<IAuthClientPayload["LoginOut"]>;

	signup(args: IAuthClientPayload["SignUpIn"]): Promise<void>;
}

export interface IAuthClientPayload {
	LoginIn: {
		username: string;
		password: string;
	};
	LoginOut: {
		token: string;
	};

	SignUpIn: {
		username: string;
		password: string;
	};
}
