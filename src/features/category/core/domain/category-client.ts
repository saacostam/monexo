import type { ICategory } from "./category";

/**
 * Client that communicates asynchronously to fetch category-related data.
 */
export interface ICategoryClient {
	create(
		req: ICategoryClientPayload["CreateRequest"],
	): Promise<ICategoryClientPayload["CreateResponse"]>;
	getAll(): Promise<ICategoryClientPayload["GetAllResponse"]>;
}

/**
 * The requests and responses for the category client.
 */
export interface ICategoryClientPayload {
	CreateRequest: {
		name: string;
		description?: string | null;
	};
	CreateResponse: {
		id: string;
	};

	GetAllResponse: ICategory[];
}
