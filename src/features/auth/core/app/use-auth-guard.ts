import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { PUBLIC_ROUTES } from "@/features/auth/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { genRoute, RouteName } from "@/shared/router/app";

export function useAuthGuard() {
	const { sessionAdapter } = useAdapters();
	const { session } = sessionAdapter;

	const publicRoutesPaths = useMemo(
		() => PUBLIC_ROUTES.map((route) => genRoute({ name: route })),
		[],
	);

	const nav = useNavigate();
	const { pathname: location } = useLocation();
	const isPublicRoute = publicRoutesPaths.some(
		(publicRoute) => location === publicRoute,
	);

	const shouldGoToApp = session.type === "authenticated" && isPublicRoute;
	const shouldGoToLogin = session.type === "unauthenticated" && !isPublicRoute;

	useEffect(() => {
		if (shouldGoToApp) {
			nav(genRoute({ name: RouteName.HOME }));
		}
	}, [nav, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoToLogin) {
			nav(genRoute({ name: RouteName.LOGIN }));
		}
	}, [nav, shouldGoToLogin]);

	const pending = shouldGoToApp || shouldGoToLogin;

	return useMemo(() => (pending ? "loading" : "success"), [pending]);
}
