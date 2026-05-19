import { screen } from "@testing-library/dom";

enum Selector {
	CONTENT = "categories-stats-content",
	SKELETON = "categories-stats-skeleton",
	QUERY_ERROR = "query-error",
}

class CategoriesStatsDriver {
	async findContent() {
		return screen.findByTestId(Selector.CONTENT);
	}

	async findQueryError() {
		return screen.findByTestId(Selector.QUERY_ERROR);
	}

	async findSkeleton() {
		return screen.findByTestId(Selector.SKELETON);
	}
}

export const categoriesStatsDriver = new CategoriesStatsDriver();
