import { waitForElementToBeRemoved, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type { ICategoryClientPayload } from "@/features/category/core/domain";
import { categoryMockFactory } from "@/features/category/core/test";
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

	it("should render elements", async () => {
		const di = mockDi();

		// We create two categories
		const privateCategory = categoryMockFactory.createCategory({
			ownership: { type: "private", userId: "user-id" },
		});
		const publicCategory = categoryMockFactory.createCategory({
			ownership: { type: "public" },
		});

		const response: ICategoryClientPayload["GetAllResponse"] = [
			privateCategory,
			publicCategory,
		];
		di.clients.category.getAll.mockResolvedValue(response);

		renderWithProviders(<TableCategories />, di);

		const skeleton = await tableCategoriesDriver.findByTestId("skeleton");
		await waitForElementToBeRemoved(skeleton);

		const content = await tableCategoriesDriver.findByTestId("content");
		expect(content).toBeVisible();

		expect(
			tableCategoriesDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();
		expect(
			tableCategoriesDriver.queryByTestId("skeleton"),
		).not.toBeInTheDocument();

		const items = tableCategoriesDriver.getAllWithinByTestId(
			content,
			"contentItem",
		);
		expect(items).toHaveLength(2);

		items.forEach((item, index) => {
			const category = response[index];
			tableCategoriesDriver.validateRow(item, category);
		});
	});

	it.each([
		{
			buttonIndex: 0,
			testId: "update-category",
			label: "edit",
		},
		{
			buttonIndex: 1,
			testId: "delete-category",
			label: "delete",
		},
	])("should SHOW (not validating integration) $label modal", async ({
		buttonIndex,
		testId,
	}) => {
		const di = mockDi();

		const category = categoryMockFactory.createCategory({
			ownership: {
				type: "private",
				userId: "user-id",
			},
		});

		const response: ICategoryClientPayload["GetAllResponse"] = [category];
		di.clients.category.getAll.mockResolvedValue(response);

		renderWithProviders(<TableCategories />, di);

		await waitForElementToBeRemoved(
			await tableCategoriesDriver.findByTestId("skeleton"),
		);

		expect(
			tableCategoriesDriver.queryByTestId("queryError"),
		).not.toBeInTheDocument();

		const item = await tableCategoriesDriver.findByTestId("contentItem");

		tableCategoriesDriver.validateRow(item, category);

		const buttons = within(item).getAllByRole("button");
		expect(buttons).toHaveLength(2);

		await userEvent.click(buttons[buttonIndex]);

		const modal = await tableCategoriesDriver.findModal();
		expect(modal).toBeVisible();
		expect(within(modal).getByTestId(testId)).toBeVisible();
	});
});
