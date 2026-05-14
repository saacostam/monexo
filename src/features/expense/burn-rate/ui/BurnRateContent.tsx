import { AreaChart } from "@mantine/charts";
import { Flex, Paper } from "@mantine/core";
import { useMemo } from "react";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { EmptyQuery } from "@/shared/components";

export interface BurnRateContentProps {
	expenses: IWithCategory<IExpense>[];
}

export function BurnRateContent({ expenses }: BurnRateContentProps) {
	const { date } = useAdapters();

	const accumulatedExpenses = useMemo(() => {
		if (expenses.length === 0) return [];

		// 1. Convert expenses to a map of { [yyyy-mm-dd]: totalForThatDay }
		const dailyTotals = expenses.reduce(
			(acc, exp) => {
				const dayString = date.fromUtcMsSinceEpochToLocalYyyyMmDd(exp.date);
				if (dayString) {
					acc[dayString] = (acc[dayString] || 0) + exp.amount;
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		// 2. Find the bounds (Min and Max)
		const dayStrings = Object.keys(dailyTotals).sort();
		let currentDay = dayStrings[0];
		const lastDay = dayStrings[dayStrings.length - 1];

		const result = [];
		let runningTotal = 0;

		// 3. Loop through every day from min to max
		while (currentDay <= lastDay) {
			const daysSpend = dailyTotals[currentDay] || 0;
			runningTotal += daysSpend;

			result.push({
				label: currentDay,
				Cumulative: runningTotal.toFixed(2), // This is the 'Burn Rate' (Cumulative)
			});

			// 4. Increment the day using your adapter
			const next = date.plus(currentDay, { days: 1 });
			if (next.ok) {
				currentDay = next.value;
			} else {
				break; // Safety break
			}
		}

		return result;
	}, [expenses, date]);

	if (accumulatedExpenses.length === 0)
		return (
			<Paper bg="transparent" p="md" withBorder>
				<EmptyQuery
					title="No date found"
					description="Try selecting a different date range or adding a new expense"
				/>
			</Paper>
		);

	return (
		<Flex justify="center">
			<AreaChart
				data={accumulatedExpenses}
				dataKey="label"
				flex="1"
				h={300}
				series={[
					{
						name: "Cumulative",
						color: "indigo.6",
					},
				]}
			/>
		</Flex>
	);
}
