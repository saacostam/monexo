import { within } from "@testing-library/dom";
import type { ICategory } from "@/features/category/core/domain";
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

	validateRow(item: HTMLElement, category: ICategory) {
		expect(within(item).getByText(category.name)).toBeVisible();
		expect(within(item).getByText(category.description)).toBeVisible();

		if (category.ownership.type === "private") {
			expect(within(item).getByText("Private")).toBeVisible();
			expect(within(item).queryAllByRole("button")).toHaveLength(2);
		} else {
			expect(within(item).getByText("Public")).toBeVisible();
			expect(within(item).queryAllByRole("button")).toHaveLength(0);
		}
	}
}

export const tableCategoriesDriver = new TableCategoriesDriver();
