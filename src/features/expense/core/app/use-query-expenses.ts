import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useQueryExpenses() {
	const { expense } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.QUERY_EXPENSES],
		queryFn: () => expense.getAll(),
	});
}
