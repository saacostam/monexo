import { useCallback } from "react";
import type { ICategory } from "@/features/category/core/domain";
import { useMutateCreateExpense } from "@/features/expense/core/app";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import {
	type IExpenseForm,
	useExpenseForm,
} from "@/features/expense/expense-form/app";
import { ExpenseForm } from "@/features/expense/expense-form/ui";
import { useAdapters } from "@/shared/adapters/core/app";

export interface CreateExpenseContentProps {
	categories: ICategory[];
	onError: (e: unknown) => void;
	onSuccess: (res: IExpenseClientPayload["CreateResponse"]) => void;
	onSettled: () => void;
}

export function CreateExpenseContent({
	categories,
	onError,
	onSuccess,
	onSettled,
}: CreateExpenseContentProps) {
	const { date: dateAdapter, notificationAdapter } = useAdapters();

	const form = useExpenseForm({
		defaultValues: {
			amount: undefined,
			categoryId: undefined,
			date: dateAdapter.todayInYyyyMmDd(),
			description: "",
			name: "",
		},
	});

	const createExpense = useMutateCreateExpense();

	const onSubmit = useCallback(
		(data: IExpenseForm) => {
			const dateValue = dateAdapter.fromYyyyMmDdToUtcMsSinceEpoch(data.date);

			if (dateValue.ok === false) {
				return notificationAdapter.notify({
					type: "error",
					title: "Error",
					msg: `Unable to create because of invalid date. Reason: ${dateValue.error}`,
				});
			}

			createExpense.mutate(
				{
					...data,
					categoryId: data.categoryId ?? null,
					date: dateValue.value,
					description: data.description ?? "",
				},
				{
					onError,
					onSuccess,
					onSettled,
				},
			);
		},
		[
			createExpense.mutate,
			dateAdapter.fromYyyyMmDdToUtcMsSinceEpoch,
			onError,
			onSuccess,
			onSettled,
			notificationAdapter.notify,
		],
	);

	return (
		<ExpenseForm
			action="Create"
			categories={categories}
			form={form}
			isPending={createExpense.isPending}
			onSubmit={onSubmit}
		/>
	);
}
