import type { IExpense, IWithCategory } from "@/features/expense/core/domain";

class ExpenseMockFactory {
	_id = 0;

	_getId() {
		this._id++;
		return String(this._id);
	}

	createExpense(overrides?: Partial<IExpense>): IExpense {
		const id = this._getId();

		return {
			id,
			name: `name-${id}`,
			description: `description-${id}`,
			amount: 20,
			date: 90_000,
			userId: `user-id-${id}`,
			categoryId: `category-id-${id}`,
			...overrides,
		};
	}

	createExpenseWithCategory(
		overrides?: Partial<IWithCategory<IExpense>>,
	): IWithCategory<IExpense> {
		const expense = this.createExpense();

		const id = expense.id;

		return {
			...expense,
			category: {
				id: `category-id-${id}`,
				name: `category-name-${id}`,
				description: `category-description-${id}`,
				ownership: {
					type: "public",
				},
			},
			...overrides,
		};
	}
}

export const expenseMockFactory = new ExpenseMockFactory();
