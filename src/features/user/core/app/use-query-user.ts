import { QueryKeys, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useQueryUser() {
	const { user } = useClients();

	return useMetaQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => user.getUser(),
	});
}
