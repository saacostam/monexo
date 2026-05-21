import { describe, expect, it } from "vitest";
import { categoryMockFactory } from "@/features/category/core/test";
import { expenseMockFactory } from "@/features/expense/core/test";
import { getExpensesBreakdownPerCategory } from "./expenses-breakdown-data-transformation";

describe("getExpensesBreakdownPerCategory", () => {
	it("returns empty array when no expenses", () => {
		const result = getExpensesBreakdownPerCategory({ expenses: [] });
		expect(result).toEqual([]);
	});

	it("aggregates amounts per category", () => {
		const category = categoryMockFactory.createCategory();
		const expense1 = expenseMockFactory.createExpenseWithCategory({
			categoryId: category.id,
			category,
			amount: 10,
		});
		const expense2 = expenseMockFactory.createExpenseWithCategory({
			categoryId: category.id,
			category,
			amount: 20,
		});

		const result = getExpensesBreakdownPerCategory({
			expenses: [expense1, expense2],
		});

		expect(result).toHaveLength(1);
		expect(result[0].value).toBe(30);
		expect(result[0].name).toBe(category.name);
	});

	it("groups expenses with no category under 'Other'", () => {
		const expense = expenseMockFactory.createExpenseWithCategory({
			categoryId: null,
			category: null,
			amount: 50,
		});

		const result = getExpensesBreakdownPerCategory({ expenses: [expense] });

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Other");
		expect(result[0].value).toBe(50);
	});

	it("excludes categories with zero total amount", () => {
		const category = categoryMockFactory.createCategory();
		const expense = expenseMockFactory.createExpenseWithCategory({
			categoryId: category.id,
			category,
			amount: 0,
		});

		const result = getExpensesBreakdownPerCategory({ expenses: [expense] });

		expect(result).toHaveLength(0);
	});

	it("handles multiple categories independently", () => {
		const cat1 = categoryMockFactory.createCategory({ name: "Food" });
		const cat2 = categoryMockFactory.createCategory({ name: "Transport" });

		const expenses = [
			expenseMockFactory.createExpenseWithCategory({
				categoryId: cat1.id,
				category: cat1,
				amount: 100,
			}),
			expenseMockFactory.createExpenseWithCategory({
				categoryId: cat2.id,
				category: cat2,
				amount: 200,
			}),
		];

		const result = getExpensesBreakdownPerCategory({ expenses });

		expect(result).toHaveLength(2);
		expect(result.find((c) => c.name === "Food")?.value).toBe(100);
		expect(result.find((c) => c.name === "Transport")?.value).toBe(200);
	});

	it("cycles colors across categories", () => {
		const expenses = Array.from({ length: 10 }, () =>
			expenseMockFactory.createExpenseWithCategory({ amount: 10 }),
		);

		const result = getExpensesBreakdownPerCategory({ expenses });

		// First and 10th should share the same color (index % 9)
		expect(result[0].color).toBe(result[9].color);
	});
});
