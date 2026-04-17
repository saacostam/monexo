import type { IAuthClientPayload } from "@/features/auth/core/domain";
import { MutationKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateLogin() {
	const { authClient } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.LOGIN],
		mutationFn: (req: IAuthClientPayload["LoginIn"]) => authClient.login(req),
	});
}
