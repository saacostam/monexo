import type { IAuthClient } from "@/features/auth/core/domain";
import type { ITodoClient } from "@/features/todo/domain";

/**
 * Interface for managing various application clients.
 */
export interface IClients {
	authClient: IAuthClient;
	todoClient: ITodoClient;
}
