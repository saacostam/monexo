import type { IAuthClient } from "@/features/auth/core/domain";
import type { ICategoryClient } from "@/features/category/core/domain";
import type { IExpenseClient } from "@/features/expense/core/domain";
import type { ITodoClient } from "@/features/todo/domain";
import type { IUserClient } from "@/features/user/core/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	authClient: IAuthClient;
	category: ICategoryClient;
	expense: IExpenseClient;
	todoClient: ITodoClient;
	user: IUserClient;
}
