import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const expenseSchema = z.object({
	amount: z.number(),
	categoryId: z.string().nullable().optional(),
	date: z.string(),
	description: z.string().min(0).max(500).nullable().optional(),
	name: z.string().min(1, "Required").max(30, "Max 30 characters allowed"),
});

export type IExpenseForm = z.infer<typeof expenseSchema>;

export interface UseExpenseFormArgs {
	defaultValues?: {
		amount?: number;
		categoryId?: string;
		date?: string;
		description?: string;
		name?: string;
	};
}

export function useExpenseForm(args?: UseExpenseFormArgs) {
	return useForm({
		defaultValues: {
			amount: args?.defaultValues?.amount ?? 0,
			categoryId: args?.defaultValues?.categoryId ?? null,
			date: args?.defaultValues?.date,
			description: args?.defaultValues?.description ?? "",
			name: args?.defaultValues?.name ?? "",
		},
		resolver: zodResolver(expenseSchema),
	});
}
