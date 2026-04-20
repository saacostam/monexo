import { useCallback, useMemo } from "react";
import z from "zod";
import type { IExpenseClient } from "@/features/expense/core/domain";
import type { IFetcherAdapter } from "@/shared/adapters/fetcher/domain";

export interface UseExpenseClientArgs {
	fetcher: IFetcherAdapter;
}

export const categorySchema = z.object({
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
});

export const expenseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	amount: z.number(),
	date: z.number(),
	userId: z.string(),
	categoryId: z.string().nullable(),
	category: categorySchema.nullable(),
});

export function useExpenseClient({
	fetcher,
}: UseExpenseClientArgs): IExpenseClient {
	const create: IExpenseClient["create"] = useCallback(
		({ amount, categoryId, date, description, name }) => {
			return fetcher.post("/expense", z.object({ id: z.string() }), {
				amount,
				categoryId,
				date,
				description,
				name,
			});
		},
		[fetcher.post],
	);

	const getAll: IExpenseClient["getAll"] = useCallback(() => {
		return fetcher.get("/expense", z.array(expenseSchema));
	}, [fetcher.get]);

	return useMemo(
		() => ({
			create,
			getAll,
		}),
		[create, getAll],
	);
}
