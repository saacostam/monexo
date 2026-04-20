import { useQueryClient } from "@tanstack/react-query";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateUpdateExpense() {
	const queryClient = useQueryClient();

	const { expense } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.UPDATE_EXPENSE],
		mutationFn: (req: IExpenseClientPayload["UpdateRequest"]) =>
			expense.update(req),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_EXPENSES],
			});
		},
	});
}
