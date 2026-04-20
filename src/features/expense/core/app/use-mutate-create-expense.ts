import { useQueryClient } from "@tanstack/react-query";
import type { IExpenseClientPayload } from "@/features/expense/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateCreateExpense() {
	const queryClient = useQueryClient();

	const { expense } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.CREATE_EXPENSE],
		mutationFn: (req: IExpenseClientPayload["CreateRequest"]) =>
			expense.create(req),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_EXPENSES],
			});
		},
	});
}
