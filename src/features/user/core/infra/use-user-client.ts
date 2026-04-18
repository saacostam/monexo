import { useCallback, useMemo } from "react";
import z from "zod";
import type { IUserClient } from "@/features/user/core/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseUserClientArgs {
	fetcher: IFetcherAdapter;
}

export function useUserClient({ fetcher }: UseUserClientArgs): IUserClient {
	const getUser: IUserClient["getUser"] = useCallback(async () => {
		return fetcher.get(
			"/user",
			z.object({
				id: z.string(),
				username: z.string(),
			}),
		);
	}, [fetcher.get]);

	return useMemo(
		() => ({
			getUser,
		}),
		[getUser],
	);
}
