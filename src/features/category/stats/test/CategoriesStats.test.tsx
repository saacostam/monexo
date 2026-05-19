import { waitForElementToBeRemoved, within } from "@testing-library/dom";
import { categoryMockFactory } from "@/features/category/core/test";
import { CategoriesStats } from "@/features/category/stats/ui";
import type {
	IExpense,
	IExpenseClientPayload,
	IWithCategory,
} from "@/features/expense/core/domain";
import { expenseMockFactory } from "@/features/expense/core/test";
import { DomainError, DomainErrorType } from "@/shared/errors/domain";
import { mockDi, renderWithProviders } from "@/tests";
import { categoriesStatsDriver } from "./categories-stats-driver";

function setupDateMocks(di: ReturnType<typeof mockDi>) {
	di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
		ok: true,
		value: 100,
	});

	di.adapters.date.plus.mockReturnValue({
		ok: true,
		value: 200,
	});
}

describe("CategoriesStats", () => {
	it("should handle loading state", async () => {
		const di = mockDi();

		setupDateMocks(di);

		di.clients.expense.getAllInRange.mockImplementation(
			() => new Promise(() => {}),
		);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();

		expect(skeleton).toBeVisible();

		expect(categoriesStatsDriver.queryContent()).not.toBeInTheDocument();
		expect(categoriesStatsDriver.queryQueryError()).not.toBeInTheDocument();
	});

	it("should handle query error state", async () => {
		const di = mockDi();

		setupDateMocks(di);

		di.clients.expense.getAllInRange.mockRejectedValue(
			new DomainError({
				type: DomainErrorType.UNKNOWN,
				msg: "error",
				userMsg: "user-facing-error",
			}),
		);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();
		await waitForElementToBeRemoved(skeleton);

		const queryError = await categoriesStatsDriver.findQueryError();
		expect(queryError).toBeVisible();

		expect(categoriesStatsDriver.queryContent()).not.toBeInTheDocument();
		expect(categoriesStatsDriver.querySkeleton()).not.toBeInTheDocument();
	});

	it("should render elements", async () => {
		const di = mockDi();

		setupDateMocks(di);

		// We create two categories
		const privateCategory = categoryMockFactory.createCategory({
			ownership: { type: "private", userId: "user-id" },
		});
		const publicCategory = categoryMockFactory.createCategory({
			ownership: { type: "public" },
		});

		// And create expenses with the following amounts
		const privateCategoryExpensesAmount = [300, 550, 400];
		const privateCategoryExpenses: IWithCategory<IExpense>[] =
			privateCategoryExpensesAmount.map((amount) =>
				expenseMockFactory.createExpenseWithCategory({
					category: privateCategory,
					categoryId: privateCategory.id,
					amount,
				}),
			);

		const publicCategoryExpensesAmount = [200, 700, 1000];
		const publicCategoryExpenses: IWithCategory<IExpense>[] =
			publicCategoryExpensesAmount.map((amount) =>
				expenseMockFactory.createExpenseWithCategory({
					category: publicCategory,
					categoryId: publicCategory.id,
					amount,
				}),
			);

		const response: IExpenseClientPayload["GetAllInRangeResponse"] = [
			...privateCategoryExpenses,
			...publicCategoryExpenses,
		];

		di.clients.expense.getAllInRange.mockResolvedValue(response);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();
		await waitForElementToBeRemoved(skeleton);

		const content = await categoriesStatsDriver.findContent();
		expect(content).toBeVisible();

		expect(categoriesStatsDriver.queryQueryError()).not.toBeInTheDocument();
		expect(categoriesStatsDriver.querySkeleton()).not.toBeInTheDocument();

		const items = within(content).getAllByTestId(
			categoriesStatsDriver.contentItemSelector,
		);
		expect(items).toHaveLength(2);

		const publicTotal = publicCategoryExpensesAmount.reduce(
			(sm, v) => sm + v,
			0,
		);
		const privateTotal = privateCategoryExpensesAmount.reduce(
			(sm, v) => sm + v,
			0,
		);
		const expectedRows = [
			{
				category: publicCategory.name,
				transactionCount: "3.00",
				average: (publicTotal / 3).toFixed(2),
				total: publicTotal.toFixed(2),
			},
			{
				category: privateCategory.name,
				transactionCount: "3.00",
				average: (privateTotal / 3).toFixed(2),
				total: privateTotal.toFixed(2),
			},
		];

		items.forEach((item, index) => {
			const expected = expectedRows[index];

			expect(within(item).getByText(expected.category)).toBeVisible();
			expect(within(item).getByText(expected.transactionCount)).toBeVisible();
			expect(within(item).getByText(expected.average)).toBeVisible();
			expect(within(item).getByText(expected.total)).toBeVisible();
		});
	});
});
