import type { IExpense, IWithCategory } from "./expense";

/**
 * Client that communicates asynchronously to fetch expense-related data.
 */
export interface IExpenseClient {
	create(
		args: IExpenseClientPayload["CreateRequest"],
	): Promise<IExpenseClientPayload["CreateResponse"]>;
	getAll(): Promise<IExpenseClientPayload["GetAllResponse"]>;
}

/**
 * The requests and responses for the expense client.
 */
export interface IExpenseClientPayload {
	CreateRequest: {
		amount: number;
		categoryId: string | null;
		date: number;
		description: string;
		name: string;
	};
	CreateResponse: {
		id: string;
	};

	GetAllResponse: IWithCategory<IExpense>[];
}
