export enum QueryKeys {
	// CATEGORY
	QUERY_CATEGORIES = "Query Categories",
	QUERY_CATEGORY_BY_ID = "Query Category By Id",

	// EXPENSES
	QUERY_EXPENSES = "Query Expenses",

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

	// EXPENSE
	CREATE_EXPENSE = "Create Expense",
	UPDATE_EXPENSE = "Update Expense",

	// TODO
	CREATE_TODO = "Create Todo",
	DELETE_TODO = "Delete Todo",
	PATCH_TODO = "Patch Todo",
}
