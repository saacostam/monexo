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
			name: RouteName.CATEGORY;
	  }
	| {
			name: RouteName.LOGIN;
	  }
	| {
			name: RouteName.HOME;
	  }
	| {
			name: RouteName.SIGNUP;
	  }
	| {
			name: RouteName.ANALYTICS;
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
			return "/analytics";
		}
		case RouteName.CATEGORY: {
			return "/category";
		}
		case RouteName.HOME: {
			return "/app";
		}
		case RouteName.LOGIN: {
			return "/";
		}
		case RouteName.SIGNUP: {
			return "/signup";
		}
	}
}
