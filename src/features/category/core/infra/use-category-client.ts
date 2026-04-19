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

	const getById: ICategoryClient["getById"] = useCallback(
		({ id }) => {
			return fetcher.get(
				`/category/${id}`,
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
			);
		},
		[fetcher.get],
	);

	const remove: ICategoryClient["remove"] = useCallback(
		({ id }) => {
			return fetcher.delete(`/category/${id}`, z.void());
		},
		[fetcher.delete],
	);

	const update: ICategoryClient["update"] = useCallback(
		({ id, name, description }) => {
			return fetcher.put(`/category/${id}`, z.object({ id: z.string() }), {
				name,
				description,
			});
		},
		[fetcher.put],
	);

	return useMemo(
		() => ({
			create,
			getAll,
			getById,
			remove,
			update,
		}),
		[create, getAll, getById, remove, update],
	);
}
