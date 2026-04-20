import { useCallback } from "react";
import type { ICategory } from "@/features/category/core/domain";
import { useMutateUpdateExpense } from "@/features/expense/core/app";
import type {
	IExpense,
	IExpenseClientPayload,
} from "@/features/expense/core/domain";
import {
	type IExpenseForm,
	useExpenseForm,
} from "@/features/expense/expense-form/app";
import { ExpenseForm } from "@/features/expense/expense-form/ui";
import { useAdapters } from "@/shared/adapters/core/app";

export interface UpdateExpenseContentProps {
	categories: ICategory[];
	expense: IExpense;
	onError: (e: unknown) => void;
	onSuccess: (res: IExpenseClientPayload["UpdateResponse"]) => void;
	onSettled: () => void;
}

export function UpdateExpenseContent({
	categories,
	expense,
	onError,
	onSuccess,
	onSettled,
}: UpdateExpenseContentProps) {
	const { date: dateAdapter, notificationAdapter } = useAdapters();

	const form = useExpenseForm({
		defaultValues: {
			amount: expense.amount,
			categoryId: expense.categoryId ?? undefined,
			date:
				dateAdapter.fromUtcMsSinceEpochToLocalYyyyMmDd(expense.date) ??
				dateAdapter.todayInYyyyMmDd(),
			description: expense.description,
			name: expense.name,
		},
	});

	const updateExpense = useMutateUpdateExpense();

	const onSubmit = useCallback(
		(data: IExpenseForm) => {
			const dateValue = dateAdapter.fromYyyyMmDdToUtcMsSinceEpoch(data.date);

			if (dateValue.ok === false) {
				return notificationAdapter.notify({
					type: "error",
					title: "Error",
					msg: `Unable to updated because of invalid date. Reason: ${dateValue.error}`,
				});
			}

			updateExpense.mutate(
				{
					id: expense.id,
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
			dateAdapter.fromYyyyMmDdToUtcMsSinceEpoch,
			expense.id,
			notificationAdapter.notify,
			onError,
			onSuccess,
			onSettled,
			updateExpense.mutate,
		],
	);

	return (
		<ExpenseForm
			action="Update"
			categories={categories}
			form={form}
			isPending={updateExpense.isPending}
			onSubmit={onSubmit}
		/>
	);
}
