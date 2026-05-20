import { Driver } from "@/tests/driver";

const tableCategoriesSelector = {
	content: {
		default: "table-categories-content",
	},
	queryError: {
		default: "query-error",
	},
	skeleton: {
		default: "table-categories-skeleton",
	},
} as const;

class TableCategoriesDriver extends Driver<typeof tableCategoriesSelector> {
	constructor() {
		super(tableCategoriesSelector);
	}
}

export const tableCategoriesDriver = new TableCategoriesDriver();
