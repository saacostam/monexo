import { useCallback, useMemo } from "react";
import type { IAuthClient } from "@/features/auth/core/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseAuthClientArgs {
	fetcher: IFetcherAdapter;
}

export function useAuthClient({ fetcher }: UseAuthClientArgs): IAuthClient {
	const login: IAuthClient["login"] = useCallback(
		async (req) => {
			return fetcher.post("/auth/login", {
				username: req.username,
				password: req.password,
			});
		},
		[fetcher.post],
	);

	return useMemo(
		() => ({
			login,
		}),
		[login],
	);
}
