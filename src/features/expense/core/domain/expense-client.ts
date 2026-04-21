import type { IExpense, IWithCategory } from "./expense";

/**
 * Client that communicates asynchronously to fetch expense-related data.
 */
export interface IExpenseClient {
	create(
		args: IExpenseClientPayload["CreateRequest"],
	): Promise<IExpenseClientPayload["CreateResponse"]>;
	remove(
		args: IExpenseClientPayload["RemoveRequest"],
	): Promise<IExpenseClientPayload["RemoveResponse"]>;
	getAll(): Promise<IExpenseClientPayload["GetAllResponse"]>;
	getAllInRange(
		args: IExpenseClientPayload["GetAllInRangeRequest"],
	): Promise<IExpenseClientPayload["GetAllInRangeResponse"]>;
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

	RemoveRequest: {
		id: string;
	};
	RemoveResponse: {
		id: string;
	};

	GetByIdRequest: {
		id: string;
	};
	GetByIdResponse: IWithCategory<IExpense>;

	GetAllResponse: IWithCategory<IExpense>[];

	GetAllInRangeRequest: {
		start: number;
		end: number;
	};
	GetAllInRangeResponse: IWithCategory<IExpense>[];

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
