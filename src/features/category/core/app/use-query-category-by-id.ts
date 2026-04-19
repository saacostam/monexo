import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export interface UseQueryCategoryByIdArgs {
	id: string;
}

export function useQueryCategoryById({ id }: UseQueryCategoryByIdArgs) {
	const { category } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.QUERY_CATEGORY_BY_ID, id],
		queryFn: () => category.getById({ id }),
	});
}
