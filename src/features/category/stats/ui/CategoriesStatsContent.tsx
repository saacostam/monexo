import type { PieChartCell } from "@mantine/charts";
import {
	Badge,
	Paper,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "@mantine/core";
import { useMemo } from "react";
import type { ICategory } from "@/features/category/core/domain";
import type { IExpense, IWithCategory } from "@/features/expense/core/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { EmptyQuery } from "@/shared/components";

export interface CategoriesStatsContentProps {
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

export function CategoriesStatsContent({
	expenses,
}: CategoriesStatsContentProps) {
	const { themeAdapter } = useAdapters();

	const tableData = useMemo(() => {
		const statsMap = new Map<
			string | null,
			{
				name: string;
				count: number;
				total: number;
				category: ICategory | null;
			}
		>();

		// 1. Group and accumulate totals
		expenses.forEach((expense) => {
			const id = expense.categoryId;
			const current = statsMap.get(id) || {
				name: expense.category?.name ?? "Other",
				count: 0,
				total: 0,
				category: expense.category,
			};

			statsMap.set(id, {
				...current,
				count: current.count + 1,
				total: current.total + expense.amount,
			});
		});

		// 2. Convert Map to Array and calculate averages/colors
		return (
			Array.from(statsMap.entries())
				.map(([id, data], index) => {
					return {
						id,
						name: data.name,
						transactionCount: data.count,
						totalSpent: data.total,
						averageTransaction: data.total / data.count,
						color: COLORS[index % COLORS.length],
					};
				})
				// 3. Sort by total spent descending (standard for analytics)
				.sort((a, b) => b.totalSpent - a.totalSpent)
		);
	}, [expenses]);

	return tableData.length === 0 ? (
		<Paper bg="transparent" p="md" withBorder>
			<EmptyQuery
				description="Try selecting a different date range or adding a new expense"
				title="No data found"
			/>
		</Paper>
	) : (
		<Table
			striped
			stripedColor={
				themeAdapter.theme === IThemeVariant.LIGHT ? "gray.1" : "dark.7"
			}
			withTableBorder
		>
			<TableThead>
				<TableTr>
					<TableTh>Category</TableTh>
					<TableTh style={{ textAlign: "end" }} visibleFrom="xs">
						Transaction Count
					</TableTh>
					<TableTh style={{ textAlign: "end" }}>Average</TableTh>
					<TableTh style={{ textAlign: "end" }}>Total</TableTh>
				</TableTr>
			</TableThead>
			<TableTbody>
				{tableData.map((row) => (
					<TableTr key={row.id}>
						<TableTd>
							<Badge color={row.color}>{row.name}</Badge>
						</TableTd>
						<TableTd style={{ textAlign: "end" }} visibleFrom="xs">
							{row.transactionCount.toFixed(2)}
						</TableTd>
						<TableTd style={{ textAlign: "end" }}>
							{row.averageTransaction.toFixed(2)}
						</TableTd>
						<TableTd style={{ textAlign: "end" }}>
							{row.transactionCount.toFixed(2)}
						</TableTd>
					</TableTr>
				))}
			</TableTbody>
		</Table>
	);
}
