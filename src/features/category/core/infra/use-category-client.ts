import { useCallback, useMemo } from "react";
import z from "zod";
import type { ICategoryClient } from "@/features/category/core/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseCategoryClientArgs {
	fetcher: IFetcherAdapter;
}

export function useCategoryClient({
	fetcher,
}: UseCategoryClientArgs): ICategoryClient {
	const create: ICategoryClient["create"] = useCallback(
		({ name, description }) => {
			return fetcher.post("/category", z.object({ id: z.string() }), {
				name,
				description,
			});
		},
		[fetcher.post],
	);

	const getAll: ICategoryClient["getAll"] = useCallback(() => {
		return fetcher.get(
			"/category",
			z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					description: z.string(),
					ownership: z.discriminatedUnion("type", [
						z.object({
							type: z.literal("public"),
						}),
						z.object({
							type: z.literal("private"),
							userId: z.string(),
						}),
					]),
				}),
			),
		);
	}, [fetcher.get]);

	return useMemo(
		() => ({
			create,
			getAll,
		}),
		[create, getAll],
	);
}
