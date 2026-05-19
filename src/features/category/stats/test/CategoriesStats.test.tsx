import { waitFor, within } from "@testing-library/dom";
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

describe("CategoriesStats", () => {
	it("should handle loading state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 100,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 200,
		});

		di.clients.expense.getAllInRange.mockImplementation(
			() => new Promise(() => {}),
		);

		renderWithProviders(
			<CategoriesStats dateRange={["2026-05-01", "2026-05-31"]} />,
			di,
		);

		const skeleton = await categoriesStatsDriver.findSkeleton();
		expect(skeleton).toBeVisible();

		await expect(categoriesStatsDriver.findContent()).rejects.toThrow();
	});

	it("should handle query error state", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 100,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 200,
		});

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
		expect(skeleton).toBeVisible();

		await waitFor(async () => {
			const queryError = await categoriesStatsDriver.findQueryError();
			expect(queryError).toBeVisible();
		});

		await expect(categoriesStatsDriver.findContent()).rejects.toThrow();
	});

	it("should render elements", async () => {
		const di = mockDi();

		di.adapters.date.fromYyyyMmDdToUtcMsSinceEpoch.mockReturnValue({
			ok: true,
			value: 100,
		});
		di.adapters.date.plus.mockReturnValue({
			ok: true,
			value: 200,
		});

		// We will use 2 categories: one private and one public
		const privateCategory = categoryMockFactory.createCategory({
			ownership: { type: "private", userId: "user-id" },
		});
		const publicCategory = categoryMockFactory.createCategory({
			ownership: { type: "public" },
		});

		const privateCategoryExpensesAmount: number[] = [300, 550, 400];
		const privateCategoryExpenses: IWithCategory<IExpense>[] =
			privateCategoryExpensesAmount.map((amount) =>
				expenseMockFactory.createExpenseWithCategory({
					category: privateCategory,
					categoryId: privateCategory.id,
					amount,
				}),
			);

		const publicCategoryExpensesAmount: number[] = [200, 700, 1000];
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

		await waitFor(async () => {
			const content = await categoriesStatsDriver.findContent();
			expect(content).toBeVisible();
		});

		await expect(categoriesStatsDriver.findQueryError()).rejects.toThrow();
		await expect(categoriesStatsDriver.findSkeleton()).rejects.toThrow();

		const content = await categoriesStatsDriver.findContent();
		expect(content).toBeVisible();

		const items = await within(content).findAllByTestId(
			categoriesStatsDriver.contentItemSelector,
		);

		expect(items).toHaveLength(2);

		// Rows are sorted by totalSpent desc
		const expectedRows = [
			{
				category: publicCategory.name,
				transactionCount: "3.00",
				average: (
					publicCategoryExpensesAmount.reduce((sm, v) => sm + v, 0) / 3
				).toFixed(2),
				total: publicCategoryExpensesAmount
					.reduce((sm, v) => sm + v, 0)
					.toFixed(2),
			},
			{
				category: privateCategory.name,
				transactionCount: "3.00",
				average: (
					privateCategoryExpensesAmount.reduce((sm, v) => sm + v, 0) / 3
				).toFixed(2),
				total: privateCategoryExpensesAmount
					.reduce((sm, v) => sm + v, 0)
					.toFixed(2),
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
