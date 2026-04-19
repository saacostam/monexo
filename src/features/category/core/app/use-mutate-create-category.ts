import { useQueryClient } from "@tanstack/react-query";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { MutationKeys, QueryKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateCreateCategory() {
	const queryClient = useQueryClient();

	const { category } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.CREATE_CATEGORY],
		mutationFn: (req: ICategoryClientPayload["CreateRequest"]) =>
			category.create(req),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.QUERY_CATEGORIES],
			});
		},
	});
}
