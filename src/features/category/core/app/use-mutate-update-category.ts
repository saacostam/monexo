import { useQueryClient } from "@tanstack/react-query";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateUpdateCategory() {
	const queryClient = useQueryClient();

	const { category } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.UPDATE_CATEGORY],
		mutationFn: (req: ICategoryClientPayload["UpdateRequest"]) =>
			category.update(req),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_CATEGORIES],
			});
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_CATEGORY_BY_ID],
			});
		},
	});
}
