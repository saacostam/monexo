import type { IExpense, IWithCategory } from "./expense";

/**
 * Client that communicates asynchronously to fetch expense-related data.
 */
export interface IExpenseClient {
	create(
		args: IExpenseClientPayload["CreateRequest"],
	): Promise<IExpenseClientPayload["CreateResponse"]>;
	getAll(): Promise<IExpenseClientPayload["GetAllResponse"]>;
	getById(
		args: IExpenseClientPayload["GetByIdRequest"],
	): Promise<IExpenseClientPayload["GetByIdResponse"]>;
	update(
		args: IExpenseClientPayload["UpdateRequest"],
	): Promise<IExpenseClientPayload["UpdateResponse"]>;
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

	GetByIdRequest: {
		id: string;
	};
	GetByIdResponse: IWithCategory<IExpense>;

	GetAllResponse: IWithCategory<IExpense>[];

	UpdateRequest: {
		id: string;
		amount: number;
		categoryId: string | null;
		date: number;
		description: string;
		name: string;
	};
	UpdateResponse: {
		id: string;
	};
}
