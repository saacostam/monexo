import { useCallback, useMemo } from "react";
import type { ILoginClient } from "@/features/auth/login/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseLoginClientArgs {
	fetcher: IFetcherAdapter;
}

export function useLoginClient({ fetcher }: UseLoginClientArgs): ILoginClient {
	const login: ILoginClient["login"] = useCallback(
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
