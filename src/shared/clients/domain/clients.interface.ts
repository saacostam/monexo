import type { IAuthClient } from "@/features/auth/login/domain";
import type { ITodoClient } from "@/features/todo/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	authClient: IAuthClient;
	todoClient: ITodoClient;
}
