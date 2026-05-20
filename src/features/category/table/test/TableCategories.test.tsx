import { waitForElementToBeRemoved } from "@testing-library/dom";
import { TableCategories } from "@/features/category/table/ui";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { mockDi, renderWithProviders } from "@/tests";
import { tableCategoriesDriver } from "./table-categories-driver";

describe("TableCategories", () => {
	it("should handle loading state", async () => {
		const di = mockDi();

		di.clients.category.getAll.mockImplementation(() => new Promise(() => {}));

		renderWithProviders(<TableCategories />, di);

		const skeleton = await tableCategoriesDriver.findByTestId("skeleton");
		expect(skeleton).toBeVisible();

		expect(
			tableCategoriesDriver.queryByTestId("content"),
		).not.toBeInTheDocument();
		expect(
			tableCategoriesDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();
	});

	it("should handle query error state", async () => {
		const di = mockDi();

		di.clients.category.getAll.mockRejectedValue(
			new DomainError({
				type: DomainErrorType.UNKNOWN,
				msg: "error",
				userMsg: "user-facing-error",
			}),
		);

		renderWithProviders(<TableCategories />, di);

		const skeleton = await tableCategoriesDriver.findByTestId("skeleton");
		await waitForElementToBeRemoved(skeleton);

		const queryError = await tableCategoriesDriver.findByTestId("queryError");
		expect(queryError).toBeVisible();

		expect(
			tableCategoriesDriver.queryByTestId("content"),
		).not.toBeInTheDocument();
		expect(
			tableCategoriesDriver.queryByTestId("skeleton"),
		).not.toBeInTheDocument();
	});
});
