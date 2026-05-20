export enum QueryKeys {
	// CATEGORY
	QUERY_CATEGORIES = "Query Categories",
	QUERY_CATEGORY_BY_ID = "Query Category By Id",

	// EXPENSES
	QUERY_EXPENSES = "Query Expenses",
	QUERY_EXPENSES_IN_RANGE = "	Query Expenses In Range",
	QUERY_EXPENSE_BY_ID = "Query Expense By Id",

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
	DELETE_EXPENSE = "Delete Expense",
	UPDATE_EXPENSE = "Update Expense",
}
