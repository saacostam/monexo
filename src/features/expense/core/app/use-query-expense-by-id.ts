import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export interface UseQueryExpenseByIdArgs {
	id: string;
}

export function useQueryExpenseById({ id }: UseQueryExpenseByIdArgs) {
	const { expense } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.QUERY_EXPENSE_BY_ID, id],
		queryFn: () => expense.getById({ id }),
	});
}
