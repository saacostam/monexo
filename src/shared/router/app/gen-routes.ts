import type { DatesRangeValue } from "@mantine/dates";

/**
 * Represents all valid application route identifiers.
 *
 * This enum acts as the single source of truth for route names,
 * decoupling navigation logic from hardcoded path strings.
 */
export enum RouteName {
	ANALYTICS = "Analytics",
	CATEGORY = "Category",
	HOME = "Home",
	LOGIN = "Login",
	SIGNUP = "SignUp",
}

/**
 * Action used to generate a route path.
 *
 * This is modeled as a discriminated union (expandable),
 * allowing each route to define its own required parameters.
 */
export type GenerateRouteAction =
	| {
			name: RouteName.ANALYTICS;
			payload?: {
				range?: DatesRangeValue<string>;
			};
	  }
	| {
			name: RouteName.CATEGORY;
	  }
	| {
			name: RouteName.HOME;
			payload?: {
				range?: DatesRangeValue<string>;
			};
	  }
	| {
			name: RouteName.LOGIN;
	  }
	| {
			name: RouteName.SIGNUP;
	  };

/**
 * Generates a URL path from a route action.
 *
 * This function centralizes route construction logic,
 * ensuring consistency and type safety across the app.
 *
 * @param action - Route generation input describing the target route
 * @returns The corresponding URL path as a string
 *
 * @example
 * ```ts
 * genRoute({ name: RouteName.HOME }); // "/app"
 * ```
 */
export function genRoute(action: GenerateRouteAction): string {
	switch (action.name) {
		case RouteName.ANALYTICS: {
			const searchParams = new URLSearchParams();

			if (action.payload?.range) {
				searchParams.append("range", formatDateRange(action.payload.range));
			}

			return `/analytics${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;
		}
		case RouteName.CATEGORY: {
			return "/category";
		}
		case RouteName.HOME: {
			const searchParams = new URLSearchParams();

			if (action.payload?.range) {
				searchParams.append("range", formatDateRange(action.payload.range));
			}

			return `/app${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;
		}
		case RouteName.LOGIN: {
			return "/";
		}
		case RouteName.SIGNUP: {
			return "/signup";
		}
	}
}

function formatDateRange(range: DatesRangeValue<string>): string {
	return range.join("_");
}
