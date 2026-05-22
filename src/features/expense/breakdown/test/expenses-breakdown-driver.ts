import { Driver } from "@/tests/driver";

const expensesBreakdownSelector = {
	content: {
		default: "expenses-breakdown-content",
	},
	queryError: {
		default: "query-error",
	},
	skeleton: {
		default: "expenses-breakdown-skeleton",
	},
};

class ExpensesBreakdownDriver extends Driver<typeof expensesBreakdownSelector> {
	constructor() {
		super(expensesBreakdownSelector);
	}
}

export const expensesBreakdownDriver = new ExpensesBreakdownDriver();
