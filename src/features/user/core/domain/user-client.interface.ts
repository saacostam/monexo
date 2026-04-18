export interface IUserClient {
	getUser(): Promise<IUserClientPayload["GetUserOut"]>;
}

export interface IUserClientPayload {
	GetUserOut: {
		id: string;
		username: string;
	};
}
