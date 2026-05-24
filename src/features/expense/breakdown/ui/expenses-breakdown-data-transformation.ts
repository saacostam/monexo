import type { PieChartCell } from "@mantine/charts";
import type { MantineColor } from "@mantine/core";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";

export function getExpensesBreakdownPerCategory(args: {
	expenses: IWithCategory<IExpense>[];
}): PieChartCell[] {
	const { expenses } = args;

	const categories = expenses.map((e) => e.category);

	// Unique categories ids
	const categoriesIdSet = new Set<string | null>();
	for (const category of categories) {
		categoriesIdSet.add(category ? category.id : null);
	}
	const categoriesId = Array.from(categoriesIdSet);

	return categoriesId.reduce((cells: PieChartCell[], categoryId, index) => {
		const category = categories.find((c) => c?.id === categoryId);

		const amount = expenses.reduce((amount, expense) => {
			return amount + (expense.categoryId === categoryId ? expense.amount : 0);
		}, 0);

		if (amount === 0) return cells;

		cells.push({
			name: category ? category.name : "Other",
			value: amount,
			color: COLORS[index % COLORS.length],
		});

		return cells;
	}, []);
}

const COLORS: MantineColor[] = [
	"indigo.6",
	"yellow.6",
	"green.6",
	"indigo.5",
	"yellow.5",
	"green.5",
	"indigo.4",
	"yellow.4",
	"green.4",
];
