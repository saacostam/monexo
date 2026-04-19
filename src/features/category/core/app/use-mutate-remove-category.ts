import { useQueryClient } from "@tanstack/react-query";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateRemoveCategory() {
	const queryClient = useQueryClient();

	const { category } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.REMOVE_CATEGORY],
		mutationFn: (req: ICategoryClientPayload["RemoveRequest"]) =>
			category.remove(req),
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
