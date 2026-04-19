import { type PropsWithChildren, useMemo } from "react";
import { useAuthClient } from "@/features/auth/core/infra";
import { useCategoryClient } from "@/features/category/infra";
import { useTodoClient } from "@/features/todo/infra";
import { useUserClient } from "@/features/user/core/infra";
import { useAdapters } from "@/shared/adapters/core/app";
import { ClientsContext } from "../app";
import type { IClients } from "../domain";

/**
 * Provider component to supply application clietns to the component tree.
 *
 * This component wraps its children with the necessary context provider (`ClientsContext.Provider`)
 * to make clients available throughout the app.
 *
 * @param {PropsWithChildren} props - The props object containing the children to be rendered.
 *
 * @returns {JSX.Element} A context provider wrapping the children with available clients.
 */
export function ClientsProvider({ children }: PropsWithChildren) {
	const { fetcherAdapter } = useAdapters();

	const authClient = useAuthClient({
		fetcher: fetcherAdapter,
	});
	const categoryClient = useCategoryClient({
		fetcher: fetcherAdapter,
	});
	const todoClient = useTodoClient();
	const userClient = useUserClient({
		fetcher: fetcherAdapter,
	});

	const clients: IClients = useMemo(
		() => ({
			authClient,
			category: categoryClient,
			todoClient,
			user: userClient,
		}),
		[authClient, categoryClient, todoClient, userClient],
	);

	return (
		<ClientsContext.Provider value={clients}>
			{children}
		</ClientsContext.Provider>
	);
}
