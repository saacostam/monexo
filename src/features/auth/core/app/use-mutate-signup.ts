import type { IAuthClientPayload } from "@/features/auth/core/domain";
import { MutationKeys, useMetaMutation } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutateSignup() {
	const { authClient } = useClients();

	return useMetaMutation({
		mutationKey: [MutationKeys.SIGNUP],
		mutationFn: (req: IAuthClientPayload["SignUpIn"]) => authClient.signup(req),
	});
}
