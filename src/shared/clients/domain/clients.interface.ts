import type { IAuthClient } from "@/features/auth/core/domain";
import type { ITodoClient } from "@/features/todo/domain";
import type { IUserClient } from "@/features/user/core/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	authClient: IAuthClient;
	todoClient: ITodoClient;
	user: IUserClient;
}
