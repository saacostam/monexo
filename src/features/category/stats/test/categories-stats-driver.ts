import { screen } from "@testing-library/dom";

enum Selector {
	CONTENT = "categories-stats-content",
	CONTENT_ITEM = "categories-stats-content-row",
	SKELETON = "categories-stats-skeleton",
	QUERY_ERROR = "query-error",
}

class CategoriesStatsDriver {
	contentItemSelector = Selector.CONTENT_ITEM;

	findContent() {
		return screen.findByTestId(Selector.CONTENT);
	}

	queryContent() {
		return screen.queryByTestId(Selector.CONTENT);
	}

	findQueryError() {
		return screen.findByTestId(Selector.QUERY_ERROR);
	}

	queryQueryError() {
		return screen.queryByTestId(Selector.QUERY_ERROR);
	}

	findSkeleton() {
		return screen.findByTestId(Selector.SKELETON);
	}

	querySkeleton() {
		return screen.queryByTestId(Selector.SKELETON);
	}
}

export const categoriesStatsDriver = new CategoriesStatsDriver();
