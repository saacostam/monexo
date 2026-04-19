import {
	type JSXElementConstructor,
	lazy,
	type PropsWithChildren,
	Suspense,
} from "react";
import { Outlet, Route, Routes } from "react-router";
import { SuspenseLoader } from "@/shared/components";
import { AppLayout, LandingLayout } from "@/shared/layout/ui";
import { genRoute, RouteName } from "@/shared/router/app";

// Lazy imports
const CategoryScreen = lazy(() => import("@/shared/screens/category-screen"));
const ErrorScreen = lazy(() => import("@/shared/screens/error-screen"));
const HomeScreen = lazy(() => import("@/shared/screens/home-screen"));
const LoginScreen = lazy(() => import("@/shared/screens/login-screen"));
const SignupScreen = lazy(() => import("@/shared/screens/signup-screen"));

export interface RouterProps {
	Provider: JSXElementConstructor<PropsWithChildren>;
}

export function Router({ Provider }: RouterProps) {
	return (
		<Provider>
			<Suspense fallback={<SuspenseLoader style={{ height: "100vh" }} />}>
				<Routes>
					<Route element={<Outlet />}>
						<Route
							element={
								<LandingLayout>
									<Outlet />
								</LandingLayout>
							}
						>
							<Route index element={<LoginScreen />} />
							<Route path="signup" element={<SignupScreen />} />
						</Route>
						<Route element={<AppLayout>{<Outlet />}</AppLayout>}>
							<Route path="app" element={<HomeScreen />} />
							<Route path="category" element={<CategoryScreen />} />
						</Route>
					</Route>
					<Route
						path="*"
						element={
							<ErrorScreen
								resetHref={genRoute({
									name: RouteName.LOGIN,
								})}
							/>
						}
					/>
				</Routes>
			</Suspense>
		</Provider>
	);
}
