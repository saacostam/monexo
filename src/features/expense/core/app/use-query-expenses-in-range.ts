import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export interface UseQueryExpensesInRangeArgs {
	start: number;
	end: number;
	enabled?: boolean;
}

export function useQueryExpensesInRange({
	start,
	end,
	enabled,
}: UseQueryExpensesInRangeArgs) {
	const { expense } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.QUERY_EXPENSES_IN_RANGE, start, end],
		queryFn: () =>
			expense.getAllInRange({
				start,
				end,
			}),
		enabled,
	});
}
