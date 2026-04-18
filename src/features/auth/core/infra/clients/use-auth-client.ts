import { useCallback, useMemo } from "react";
import z from "zod";
import type { IAuthClient } from "@/features/auth/core/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseAuthClientArgs {
	fetcher: IFetcherAdapter;
}

export function useAuthClient({ fetcher }: UseAuthClientArgs): IAuthClient {
	const login: IAuthClient["login"] = useCallback(
		async (req) => {
			return fetcher.post(
				"/auth/login",
				z.object({
					token: z.string(),
				}),
				{
					username: req.username,
					password: req.password,
				},
			);
		},
		[fetcher.post],
	);

	const signup: IAuthClient["signup"] = useCallback(
		async (req) => {
			return fetcher.post("/auth/signup", z.void(), {
				username: req.username,
				password: req.password,
			});
		},
		[fetcher.post],
	);

	return useMemo(
		() => ({
			login,
			signup,
		}),
		[login, signup],
	);
}
