import { PieChart, type PieChartCell } from "@mantine/charts";
import { Flex, Indicator, Paper, Text } from "@mantine/core";
import { useMemo } from "react";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { EmptyQuery } from "@/shared/components";

export interface ExpensesBreakdownContentProps {
	expenses: IWithCategory<IExpense>[];
}

const COLORS: PieChartCell["color"][] = [
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

export function ExpensesBreakdownContent({
	expenses,
}: ExpensesBreakdownContentProps) {
	const pieChartCells: PieChartCell[] = useMemo(() => {
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
				return (
					amount + (expense.categoryId === categoryId ? expense.amount : 0)
				);
			}, 0);

			if (amount === 0) return cells;

			cells.push({
				name: category ? category.name : "Other",
				value: amount,
				color: COLORS[index % COLORS.length],
			});

			return cells;
		}, []);
	}, [expenses]);

	if (pieChartCells.length === 0)
		return (
			<Paper bg="transparent" p="md" withBorder>
				<EmptyQuery
					title="No data found"
					description="Try selecting a different date range or adding a new expense"
				/>
			</Paper>
		);

	return (
		<>
			<Flex justify="center">
				<PieChart
					data={pieChartCells}
					flex="1"
					labelsPosition="outside"
					labelsType="percent"
					withLabels
					withLabelsLine
					withTooltip
				/>
			</Flex>
			<Flex direction="column" gap="0.5rem" wrap="wrap">
				{pieChartCells.map(({ color, name, value }, i) => (
					<Flex align="center" gap="xs" key={+i}>
						<Indicator color={color} />
						<Text size="xs">
							<Text component="span" fw="bold" size="xs">
								{name}
							</Text>
							{" • "}$ {value}
						</Text>
					</Flex>
				))}
			</Flex>
		</>
	);
}
