import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useQueryAllCategories() {
	const { category } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.QUERY_CATEGORIES],
		queryFn: () => category.getAll(),
	});
}
