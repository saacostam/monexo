import { Skeleton } from "@mantine/core";
import { useQueryAllCategories } from "@/features/category/core/app";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { useRetry } from "@/shared/async-state";
import { QueryError } from "@/shared/components";
import { CreateExpenseContent } from "./CreateExpenseContent";

export interface CreateExpenseProps {
	onError: (e: unknown) => void;
	onSuccess: (res: IExpenseClientPayload["CreateResponse"]) => void;
	onSettled: () => void;
}

export function CreateExpense({
	onError,
	onSuccess,
	onSettled,
}: CreateExpenseProps) {
	const queryAllCategories = useQueryAllCategories().useQuery();

	const retry = useRetry(
		queryAllCategories.refetch,
		queryAllCategories.isLoading,
	);

	if (queryAllCategories.isError)
		return (
			<QueryError
				msg="Unable to retrieve categories information"
				retry={retry}
				error={queryAllCategories.error}
				where="CreateExpense.queryAllCategories.isError"
			/>
		);

	if (queryAllCategories.isSuccess)
		return (
			<CreateExpenseContent
				categories={queryAllCategories.data}
				onError={onError}
				onSuccess={onSuccess}
				onSettled={onSettled}
			/>
		);

	return <Skeleton h="128px" />;
}
