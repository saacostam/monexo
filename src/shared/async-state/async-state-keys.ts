export enum QueryKeys {
	// CATEGORY
	QUERY_CATEGORIES = "Query Categories",
	QUERY_CATEGORY_BY_ID = "Query Category By Id",

	// TODO
	QUERY_TODOS = "Query Todos",

	// USER
	USER = "User",
}

export enum MutationKeys {
	// AUTH
	LOGIN = "Login",
	SIGNUP = "SignUp",

	// CATEGORY
	CREATE_CATEGORY = "Create Category",
	REMOVE_CATEGORY = "Remove Category",
	UPDATE_CATEGORY = "Update Category",

	// TODO
	CREATE_TODO = "Create Todo",
	DELETE_TODO = "Delete Todo",
	PATCH_TODO = "Patch Todo",
}
