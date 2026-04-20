import { useQueryClient } from "@tanstack/react-query";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateDeleteExpense() {
	const queryClient = useQueryClient();

	const { expense } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.DELETE_EXPENSE],
		mutationFn: (req: IExpenseClientPayload["RemoveRequest"]) =>
			expense.remove(req),
		onSettled: (_, __, req) => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_EXPENSES],
			});
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_EXPENSE_BY_ID, req.id],
			});
		},
	});
}
