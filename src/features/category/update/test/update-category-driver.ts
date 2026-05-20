import { Driver } from "@/tests/driver";

const selectors = {
	content: {
		default: "update-category-content",
	},
	queryError: {
		default: "query-error",
	},
	skeleton: {
		default: "update-category-skeleton",
	},
} as const;

class UpdateCategoryDriver extends Driver<typeof selectors> {
	constructor() {
		super(selectors);
	}
}

export const updateCategoryDriver = new UpdateCategoryDriver();
