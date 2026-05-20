import { Driver } from "@/tests/driver";

const tableCategoriesSelector = {
	content: {
		default: "table-categories-content",
	},
	contentItem: {
		default: "table-categories-content-row",
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
