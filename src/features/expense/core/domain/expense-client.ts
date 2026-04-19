import type { IExpense, IWithCategory } from "./expense";

/**
 * Client that communicates asynchronously to fetch expense-related data.
 */
export interface IExpenseClient {
	getAll(): Promise<IExpenseClientPayload["GetAllResponse"]>;
}

/**
 * The requests and responses for the expense client.
 */
export interface IExpenseClientPayload {
	GetAllResponse: IWithCategory<IExpense>[];
}
