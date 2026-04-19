import type { ICategory } from "./category";

/**
 * Client that communicates asynchronously to fetch category-related data.
 */
export interface ICategoryClient {
	getAll(): Promise<ICategoryClientPayload["GetAllResponse"]>;
}

/**
 * The requests and responses for the category client.
 */
export interface ICategoryClientPayload {
	GetAllResponse: ICategory[];
}
