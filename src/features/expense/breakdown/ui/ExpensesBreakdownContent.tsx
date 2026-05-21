import { PieChart, type PieChartCell } from "@mantine/charts";
import { Box, Flex, Paper, Text } from "@mantine/core";
import { useMemo } from "react";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { EmptyQuery } from "@/shared/components";
import { getExpensesBreakdownPerCategory } from "./expenses-breakdown-data-transformation";

export interface ExpensesBreakdownContentProps {
	expenses: IWithCategory<IExpense>[];
}

export function ExpensesBreakdownContent({
	expenses,
}: ExpensesBreakdownContentProps) {
	const pieChartCells: PieChartCell[] = useMemo(
		() => getExpensesBreakdownPerCategory({ expenses }),
		[expenses],
	);

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
						<Box bdrs="100%" bg={color} h="0.5rem" w="0.5rem" />
						<Text size="xs">
							<Text component="span" fw="bold" size="xs">
								{name}
							</Text>
							{" • "}$ {value.toFixed(2)}
						</Text>
					</Flex>
				))}
			</Flex>
		</>
	);
}
