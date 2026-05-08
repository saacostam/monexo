import { useCallback } from "react";
import { useQueryAllCategories } from "@/features/category/core/app";
import { useQueryExpenseById } from "@/features/expense/core/app";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { ExpenseFormSkeleton } from "@/features/expense/expense-form/ui";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { UpdateExpenseContent } from "./UpdateExpenseContent";

export interface UpdateExpenseProps {
	id: string;
	onError: (e: unknown) => void;
	onSuccess: (res: IExpenseClientPayload["UpdateResponse"]) => void;
	onSettled: () => void;
}

export function UpdateExpense({
	id,
	onError,
	onSuccess,
	onSettled,
}: UpdateExpenseProps) {
	const queryAllCategories = useQueryAllCategories().useQuery();
	const queryExpense = useQueryExpenseById({ id }).useQuery();

	const refetch = useCallback(() => {
		if (queryAllCategories.isError) queryAllCategories.refetch();
		if (queryExpense.isError) queryExpense.refetch();
	}, [
		queryAllCategories.isError,
		queryAllCategories.refetch,
		queryExpense.isError,
		queryExpense.refetch,
	]);
	const refetchIsLoading =
		queryAllCategories.isLoading || queryExpense.isLoading;

	const retry = useRetry(refetch, refetchIsLoading);

	if (queryAllCategories.isError || queryExpense.isError) {
		return (
			<QueryError
				msg="Unable to retrieve expense information"
				retry={retry}
				error={[queryAllCategories.error, queryExpense.error]}
				where="UpdateExpense.(queries).isError"
			/>
		);
	}

	if (queryAllCategories.isSuccess && queryExpense.isSuccess) {
		return (
			<UpdateExpenseContent
				categories={queryAllCategories.data}
				expense={queryExpense.data}
				onError={onError}
				onSuccess={onSuccess}
				onSettled={onSettled}
			/>
		);
	}

	return <ExpenseFormSkeleton />;
}
